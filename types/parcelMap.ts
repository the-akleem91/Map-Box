export type SelectedPolygon = {
  id: number | null;
  bbox: number[][] | null;
};
export type RenderPolygonTypes = {
  polygonCoordinates: any;
  isDrawing: boolean;
  selectedPolygon: SelectedPolygon;
  setSelectedPolygon: React.Dispatch<React.SetStateAction<SelectedPolygon>>;
};
