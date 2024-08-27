/* eslint-disable max-lines-per-function */
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAnalytics } from "@segment/analytics-react-native";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Checkbox from "expo-checkbox";
import { router, useGlobalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import WebView from "react-native-webview";

import { queryClient } from "@/api/apiProvider";
import { useSendReportGenerationNotification } from "@/api/useEmail";
import { useInspection, useUpdateInspection } from "@/api/useInspection";
import { useSendAlert, useSendSlackThread } from "@/api/useSlack";
import {
  useCreateCheckoutSession,
  useGetStripeCustomer,
  useUpdateCustomer,
} from "@/api/useStripe";
import HeaderAddress from "@/components/Inspection/HeaderAddress";
import { OrderConfirmation } from "@/components/Inspection/InspectionById/OrderConfirmation";
import Button from "@/components/ui/Button";
import ModalComponent from "@/components/ui/Modal";
import UploadImage from "@/components/UploadImage";
import { useSession } from "@/contexts/authProvider";
import { commonContainer } from "@/libs/commonStyles";
import {
  GR_ORG_ID,
  INSPECTION_STATUS,
  REPORT_STRIPE_PRICE_IDS,
  SKIP_ORG_ID,
} from "@/libs/constants";
import { ErrorMessageStyle } from "@/libs/ToastStyles";
import { getDetailedAddress } from "@/libs/utils";

type Credits = {
  measurements: number;
  weather: number;
  "proof-of-loss": number;
};

const reportsList = [
  {
    title: "Measurements Report",
    description: "Human-generated, user-reviewed property measurements.",
    price: 15,
    //@ts-ignore
    priceId: REPORT_STRIPE_PRICE_IDS["Measurements Report"].paid,
    deliveryTime: "within 15 mins",
    Icon: (
      <MaterialCommunityIcons name="tape-measure" size={36} color="#4F46E5" />
    ),
    isGenerated: false,
    isDisabled: false,
    isFree: false,
  },
  {
    title: "Weather Report",
    description: "Hail damage detection and history storm activity.",
    price: 25,
    //@ts-ignore
    priceId: REPORT_STRIPE_PRICE_IDS["Weather Report"].paid,
    deliveryTime: "within 120 mins",
    Icon: <Ionicons name="cloud-outline" size={36} color="#4F46E5" />,
    isGenerated: false,
    isDisabled: false,
    isFree: false,
  },
  {
    title: "Proof-of-Loss Report",
    description:
      "Roof overview and elements visible on the roof. Requires at least 10 inspection images.",
    price: 60,
    //@ts-ignore
    priceId: REPORT_STRIPE_PRICE_IDS["Proof-of-Loss Report"].paid,
    deliveryTime: "within 24 hrs",
    Icon: <Ionicons name="home-outline" size={36} color="#4F46E5" />,
    isGenerated: false,
    isDisabled: false,
    isFree: false,
  },
];

export default function OrderReport() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { session } = useSession();

  const { track } = useAnalytics();

  const foundGranularOrg = session?.roles.find(
    (org: any) => org?.id === GR_ORG_ID
  );

  const { inspectionId, action } = useGlobalSearchParams<{
    inspectionId: string;
    action?: string;
  }>();

  const { data: inspection, isLoading } = useInspection({
    variables: { id: inspectionId as string },
    enabled: !!inspectionId,
  });

  const { mutateAsync: sendSlackAlert } = useSendAlert();
  const { mutateAsync: sendSlackThread } = useSendSlackThread();
  const {
    mutateAsync: createCheckoutSession,
    isPending: isCreatingCheckoutSession,
  } = useCreateCheckoutSession();

  const { mutateAsync: sendReportGenerationNotification } =
    useSendReportGenerationNotification();

  const { data: customer, isLoading: isCustomerLoading } = useGetStripeCustomer(
    {
      variables: { customerId: session?.metadata?.customerId as string },
      enabled: !!session?.metadata?.customerId,
    }
  );

  const credits: Credits = JSON.parse(customer?.metadata?.credits || "{}");

  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  const { mutateAsync: updateInspection } = useUpdateInspection();

  const reports = useMemo(() => {
    const { percent_off } = customer?.discount?.coupon || {};

    return reportsList.map((item) => {
      const isGenerated = inspection?.generatedReports?.includes(item.title);
      // check if report is disabled
      const isDisabled =
        isGenerated ||
        (item.title === "Proof-of-Loss Report" &&
          (inspection?.imageCount || 0) < 10);

      // check if the user has credits for the report
      const hasCredit = Object.keys(credits).some((creditType) => {
        //@ts-ignore
        const isValid = credits?.[creditType] > 0;

        const result =
          item.title.toLowerCase().includes(creditType.toLowerCase()) &&
          isValid;

        return result;
      });

      const isFree = Boolean(foundGranularOrg) || !credits || hasCredit;

      if (isFree) {
        item.priceId = REPORT_STRIPE_PRICE_IDS[item.title].free;
      }

      return {
        ...item,
        isGenerated,
        isDisabled,
        isFree,
        price: percent_off
          ? item.price - item.price * (percent_off / 100)
          : item.price,
      };
    });
  }, [
    customer?.discount?.coupon,
    inspection?.generatedReports,
    inspection?.imageCount,
    credits,
    foundGranularOrg,
  ]);

  useEffect(() => {
    if (selectedReports.length === 0 && !isInitialized && customer) {
      const selected = reports
        .filter((report) => !report.isDisabled)
        .map((report) => report.title);

      setSelectedReports(selected);

      updateTotalAndSubtotal(selected);
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, isInitialized, isCustomerLoading]);

  const updateTotalAndSubtotal = (selectedReports: string[]) => {
    const subtotalValue = selectedReports.reduce((acc, report) => {
      const reportPrice = reports.find((r) => r.title === report)?.price || 0;
      return acc + reportPrice;
    }, 0);

    const totalValue = foundGranularOrg
      ? 0
      : selectedReports.reduce((total, selectedReport) => {
          const report = reports.find((item) => item.title === selectedReport);

          if (report?.isFree) return total;
          return total + (report?.price || 0);
        }, 0);

    setTotal(totalValue);
    setSubtotal(subtotalValue);
  };

  const address = inspection?.property?.address;
  const { cityAndZipCode, propertyStreet } = getDetailedAddress(address);

  const headerTitle = (props: any) => {
    return isLoading ? (
      <Text className="text-2xl font-normal">Loading...</Text>
    ) : (
      <HeaderAddress
        propertyStreet={propertyStreet}
        cityAndZipCode={cityAndZipCode}
        {...props}
      />
    );
  };

  const navigation = useNavigation();

  const headerLeft = (props: any) => {
    return (
      <Pressable onPress={() => router.push(`/`)}>
        <Ionicons size={24} className=" text-red-400" name="chevron-back" />
      </Pressable>
    );
  };

  navigation.setOptions({
    // headerLeft,
    headerTitle: headerTitle,
    headerBackTitleVisible: false,
    headerStatusBarHeight: 8,
  });

  const handleCheckboxChange = (report: string) => {
    setSelectedReports((prevSelectedReports) => {
      const newList = prevSelectedReports.includes(report)
        ? prevSelectedReports.filter((item) => item !== report)
        : [...prevSelectedReports, report];

      updateTotalAndSubtotal(newList);

      return newList;
    });
  };

  const baseUrl = "https://inspect.properties";

  const getRequestedReports = () => {
    const reportTypes: Record<string, string> = {
      "Measurements Report": "measurement",
      // "Weather Report": "weather",
      "Proof-of-Loss Report": "proof-of-loss",
    };

    const types = selectedReports
      .map((report) => reportTypes[report])
      .filter(Boolean);

    return types.join(", ");
  };

  const { mutate: autoGenerateWeatherReport } = useMutation({
    mutationFn: async () => {
      const response = await axios
        .post("/api/admin/auto-generate-weather-report", {
          inspectionId: inspection?.id,
          orgId: inspection?.owner,
        })
        .catch((error) => {
          track(`Failed to auto generate weather report`, {
            email: session?.email || "",
            address: address || "",
            error,
          });
        });

      return response?.data;
    },
    onSuccess() {
      if (inspection?.slackThreadTs) {
        sendSlackThread(
          {
            channel:
              inspection?.owner === SKIP_ORG_ID
                ? "training-orders"
                : "order-management",
            text: `Weather Report auto-generated`,
            thread_ts: inspection?.slackThreadTs,
          },
          {
            onError(error: any) {
              track("Slack Thread for weather report generation Failed", {
                error: error,
              });
            },
          }
        );
      } else {
        console.log("could not find thread value");
      }
    },
  });

  const discountPrice = subtotal - total;
  const discountPercent = (discountPrice / subtotal) * 100;

  const sendNotifications = async (isFree: boolean) => {
    const requestedReports: Record<string, { isFree: boolean }> = {};

    reportsList
      .filter((rep) =>
        selectedReports.some((selected) => selected === rep.title)
      )
      .forEach((report) => {
        const key = `${report.title.replace(" Report", "").toLowerCase()}`;
        requestedReports[key] = { isFree: report.isFree };
      });

    sendReportGenerationNotification(
      {
        address: address as string,
        selectedReports: requestedReports,
        subtotal: subtotal,
        total: total,
        discountPercentage: `${discountPercent}%`,
        discountValue: discountPrice,
        orderLink: `${baseUrl}/inspections/${inspection?.id}`,
        orgId: inspection?.owner,
        inspectionId: inspection?.id || "",
      },
      {
        onSettled() {
          setPaymentUrl(null);
          setIsSubmitting(false);
          setIsCompleted(true);
        },
      }
    ).catch((error) => {
      console.log(error);
    });
  };

  const handleReportsGeneration = async (isFree = false) => {
    setIsSubmitting(true);

    const isProofOfLossSelected = selectedReports.includes(
      "Proof-of-Loss Report"
    );
    const isMeasurementReportSelected = selectedReports.includes(
      "Measurements Report"
    );
    const isWeatherReportSelected = selectedReports.includes("Weather Report");

    const type = getRequestedReports();

    const trackUserReportGeneration = () => {
      track(`User wants to generate the following reports: ${type}`, {
        email: session?.email ?? "",
        address: address || "",
        type,
      });
    };

    const updateCustomerCredits = async (newCredits: Credits) => {
      if (!customer?.id) return;

      try {
        await updateCustomer(
          {
            customerId: customer?.id,
            credits: JSON.stringify({
              ...(credits || {}),
              ...newCredits,
            }),
          },
          {
            onSuccess(data) {
              queryClient.invalidateQueries({
                queryKey: ["getStripeCustomer"],
              });
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    const getGeneratedReports = () => {
      const generatedReports = [];

      if (isMeasurementReportSelected)
        generatedReports.push("Measurements Report");

      if (isWeatherReportSelected) generatedReports.push("Weather Report");

      if (isProofOfLossSelected) generatedReports.push("Proof-of-Loss Report");

      return generatedReports;
    };

    const updateInspectionStatus = async (
      generatedReports: string[],
      statusMessage: string
    ) => {
      const newGeneratedReports = [
        ...(inspection?.generatedReports || []),
        ...generatedReports,
      ];
      const otherFields: Record<string, any> = {};

      if (isProofOfLossSelected) {
        otherFields.status = INSPECTION_STATUS.PROCESSING;
      }

      try {
        await updateInspection(
          {
            id: inspection?.id as string,
            statusMessage,
            generatedReports: newGeneratedReports,
            ...otherFields,
          },
          {
            onSuccess() {
              queryClient.invalidateQueries({
                queryKey: ["inspection"],
              });
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };

    const handleNonProofOfLossReportsGeneration = async () => {
      trackUserReportGeneration();

      if (isWeatherReportSelected) {
        autoGenerateWeatherReport();
      }

      if (customer?.id) {
        const newCredits = {} as Credits;
        if (isMeasurementReportSelected && credits?.measurements > 0) {
          newCredits.measurements = credits.measurements - 1;
        }
        if (isWeatherReportSelected && credits?.weather > 0) {
          newCredits.weather = credits.weather - 1;
        }
        if (Object.keys(newCredits).length > 0) {
          await updateCustomerCredits(newCredits);
        }
      }

      const generatedReports = getGeneratedReports();
      const statusMessage =
        isMeasurementReportSelected && isWeatherReportSelected
          ? "We are in the process of generating your measurement and weather reports."
          : isMeasurementReportSelected
          ? "We are in the process of generating your measurement report."
          : "We are in the process of generating your weather report";

      await updateInspectionStatus(generatedReports, statusMessage);
      sendNotifications(isFree);
    };

    const handleWithProofOfLossReportGeneration = async () => {
      trackUserReportGeneration();

      try {
        await axios.post(`${baseUrl}/api/callbacks/generate-annotations`, {
          inspectionId: inspectionId,
          orgId: inspection?.owner,
        });

        // segment.track("Start Analysis Successful", {
        //   email: session?.user.email,
        //   inspectionId: id,
        // });

        if (customer?.id) {
          const newCredits = {} as Credits;
          if (credits["proof-of-loss"] > 0) {
            newCredits["proof-of-loss"] = credits["proof-of-loss"] - 1;
          }
          if (isMeasurementReportSelected && credits?.measurements > 0) {
            newCredits.measurements = credits.measurements - 1;
          }
          if (isWeatherReportSelected && credits?.weather > 0) {
            newCredits.weather = credits.weather - 1;
          }
          if (Object.keys(newCredits).length > 0) {
            await updateCustomerCredits(newCredits);
          }
        }

        const generatedReports = getGeneratedReports();

        const statusMessage =
          isMeasurementReportSelected && isWeatherReportSelected
            ? "We are in the process of generating your measurement, weather, and proof-of-Loss reports."
            : isMeasurementReportSelected
            ? "We are in the process of generating your measurement and proof-of-Loss reports."
            : isWeatherReportSelected
            ? "We are in the process of generating your weather and proof-of-Loss reports."
            : "We are in the process of generating your proof-of-Loss report";

        if (inspection?.id) {
          await updateInspectionStatus(generatedReports, statusMessage);
        }

        sendNotifications(isFree);
      } catch (error) {
        track("Start Analysis Failed", {
          email: session?.email,
          inspectionId,
        });
        setIsSubmitting(false);
        Toast.show(
          "Something went wrong, our team has been notified!",
          ErrorMessageStyle
        );
      }
    };

    try {
      if (isProofOfLossSelected) {
        await handleWithProofOfLossReportGeneration();
      } else {
        await handleNonProofOfLossReportsGeneration();
      }
    } catch (error: any) {
      track("Generating report Failed", {
        email: session?.email,
        address: address,
        inspectionId,
        error: error,
      });

      Toast.show(
        "Something went wrong, our team has been notified!",
        ErrorMessageStyle
      );

      router.push(`/inspection/${inspectionId}`);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const type = getRequestedReports();

    if (inspection?.slackThreadTs) {
      sendSlackThread(
        {
          channel:
            inspection?.owner === SKIP_ORG_ID
              ? "training-orders"
              : "order-management",
          text: `${session?.email} wants ${type} report`,
          thread_ts: inspection?.slackThreadTs,
        },
        {
          onError(error: any) {
            track("Slack Thread Failed", { error: error });
          },
        }
      );
    } else {
      sendSlackAlert(
        {
          channel:
            inspection?.owner === SKIP_ORG_ID
              ? "training-orders"
              : "order-management",
          message: `${session?.email} wants ${type}`,
        },
        {
          onError(error: any) {
            track("Slack Thread Failed", { error: error });
          },
        }
      );
    }

    if (
      total > 0
      // && !foundGranularOrg
    ) {
      const info = {
        // client_secret: data?.client_secret,
        email: session?.email || "",
        inspectionId: inspection?.id,
        discountPercent,
        discountPrice,
        subtotal,
        requestedReports: reports
          .filter((rep) =>
            selectedReports.some((selected) => selected === rep.title)
          )
          // eslint-disable-next-line unused-imports/no-unused-vars
          .map(({ Icon, ...rest }) => ({ ...rest })),
        total,
      };

      const stringifyedInfo = JSON.stringify(info);

      const encordedInfo = encodeURIComponent(stringifyedInfo);

      createCheckoutSession(
        {
          lineItems: reports
            .filter((rep) =>
              selectedReports.some((selected) => selected === rep.title)
            )
            .map((item) => ({ price: item.priceId, quantity: 1 })),
          customerId: session?.metadata?.customerId,
          email: session?.email || "",
          inspectionId: inspectionId as string,
          selectedReports: `${type} reports`,
          successUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/payment/success`,
        },
        {
          onSuccess(data) {
            if (data?.url) {
              setPaymentUrl(data.url);
            }
          },
        }
      ).catch(() => {
        Toast.show(
          "Something went wrong with initiate payment. Please try again later",
          ErrorMessageStyle
        );
      });
    } else {
      handleReportsGeneration(true);
    }
  };

  const handleNavigationStateChange = (navState: Record<string, any>) => {
    const { url } = navState;

    if (url.includes(`${process.env.EXPO_PUBLIC_BASE_URL}/payment/success`)) {
      handleReportsGeneration();
    } // TODO: handle error case
  };

  return isCompleted ? (
    <OrderConfirmation
      email={session?.email || ""}
      requestedReports={reports.filter((rep) =>
        selectedReports.some((selected) => selected === rep.title)
      )}
      total={total}
      discountPercent={discountPercent}
      discountPrice={discountPrice}
      subtotal={subtotal}
    >
      <Button
        className="w-full"
        title="Finish"
        onPress={() => {
          router.push(`/inspection/${inspectionId}`);
          setPaymentUrl(null);
          setIsCompleted(false);
          setIsSubmitting(false);
        }}
      />
    </OrderConfirmation>
  ) : paymentUrl ? (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  ) : (
    <ScrollView contentContainerStyle={commonContainer.container}>
      <Text style={styles.headerText}>
        Please select the reports you want to generate
      </Text>

      <View style={styles.reportList}>
        {reports.map((report, index) => (
          <Pressable
            key={index}
            style={styles.reportItem}
            onPress={() => handleCheckboxChange(report.title)}
            disabled={report.isDisabled}
          >
            {report.Icon}
            <View style={styles.reportDetails}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {report.title}
              </Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: report.isFree ? "#22c55e" : "#4F46E5",
                }}
              >
                {report.isFree ? "Free" : `$ ${report.price}`}
              </Text>
            </View>
            <View className="flex flex-row items-start gap-2">
              {report.isGenerated && (
                <Text className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                  Submitted
                </Text>
              )}
              <Checkbox
                style={{ height: 24, width: 24 }}
                color={"#4F46E5"}
                value={selectedReports.includes(report.title)}
                onValueChange={() => handleCheckboxChange(report.title)}
                disabled={report.isDisabled}
              />
            </View>
          </Pressable>
        ))}
        <View className="my-3 flex flex-row items-center justify-between border-t border-gray-200 pt-3 text-xl font-semibold md:my-5 md:pt-5">
          <Text>Total</Text>
          <View>
            {subtotal !== total && subtotal !== 0 && (
              <Text className="text-right text-sm font-normal text-gray-500 line-through">
                ${subtotal} USD
              </Text>
            )}
            <Text>${total > 0 ? total.toFixed(2) : total} USD</Text>
          </View>
        </View>
      </View>

      <Button
        title="Submit"
        onPress={handleSubmit}
        disabled={
          isSubmitting || isCreatingCheckoutSession || !selectedReports.length
        }
        isLoading={isSubmitting || isCreatingCheckoutSession}
      />
      {action && (
        <Text style={{ textAlign: "center", paddingVertical: 4 }}>or</Text>
      )}
      {action && (
        <Button
          title="Skip and Upload Images"
          variant="outline"
          onPress={() => router.replace(`inspection/${inspectionId}/images`)}
        />
      )}
      <ModalComponent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <UploadImage setIsModalOpen={setIsModalOpen} inspection={inspection} />
      </ModalComponent>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  reportList: {
    display: "flex",
    gap: 12,
    marginTop: 16,
  },
  reportItem: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    backgroundColor: "#4F46E520",
    padding: 16,
    borderRadius: 12,
  },
  reportDetails: {
    display: "flex",
    flex: 1,
    gap: 4,
  },
  reportDescription: {
    fontSize: 12,
    color: "#6E6E6E",
  },
  totalPrice: { fontWeight: "500", fontSize: 19 },
});
