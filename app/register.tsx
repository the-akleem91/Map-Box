import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import StepOne from "../components/auth/StepOne";
import StepTwo from "../components/auth/StepTwo";

export default function Register() {
  const [currentStep, setCurrentStep] = useState(0);
  const { step } = useLocalSearchParams();
  const steps = useMemo(() => {
    return [
      { title: "detail", component: <StepOne /> },
      { title: "verify", component: <StepTwo /> },
    ];
  }, [step]);

  useEffect(() => {
    if (step) {
      const currentStep = steps.findIndex((item) => item.title === step);
      setCurrentStep(currentStep);
    } else setCurrentStep(0);
  }, [steps, step]);

  return <View style={{ flex: 1 }}>{steps[currentStep]?.component}</View>;
}
