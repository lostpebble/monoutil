import { useEffect, useRef } from "react";
import RelationGraph, {
  type RelationGraphComponent,
  type RGJsonData,
  type RGNodeSlotProps,
  type RGOptions,
} from "relation-graph-react";
import CircumIcon from "./MyDemoIcons";
import "./node-style4.scss";

const NodeSlot = ({ node }: RGNodeSlotProps) => {
  return (
    <div className="c-round w-18 h-18">
      <CircumIcon color="#ffffff" size="70px" name={node.data?.icon} />
    </div>
  );
};

const showGraph = async (graphRef: RelationGraphComponent) => {
  const __graph_json_data: RGJsonData = {
    rootId: "a",
    nodes: [
      { id: "a", text: "a", data: { icon: "football" } },
      { id: "b", text: "b", data: { icon: "football" } },
      { id: "b1", text: "b1", data: { icon: "football" } },
      { id: "b2", text: "b2", data: { icon: "football" } },
      { id: "b2-1", text: "b2-1", data: { icon: "football" } },
      { id: "b2-2", text: "b2-2", data: { icon: "football" } },
      { id: "c", text: "c", data: { icon: "football" } },
      { id: "c1", text: "c1", data: { icon: "football" } },
      { id: "c2", text: "c2", data: { icon: "football" } },
      { id: "c3", text: "c3", data: { icon: "football" } },
    ],
    lines: [
      { from: "a", to: "b", text: "" },
      { from: "b", to: "b1", text: "" },
      { from: "b", to: "b2", text: "" },
      { from: "b2", to: "b2-1", text: "" },
      { from: "b2", to: "b2-2", text: "" },
      { from: "a", to: "c", text: "" },
      { from: "c", to: "c1", text: "" },
      { from: "c", to: "c2", text: "" },
      { from: "c", to: "c3", text: "" },
    ],
  };
  const graphInstance = graphRef.getInstance();
  await graphInstance.setJsonData(__graph_json_data);
  graphInstance.moveToCenter();
  graphInstance.zoomToFit();
};

const NodeStyle4: React.FC = () => {
  const graphRef = useRef<RelationGraphComponent | null>(null);

  const graphOptions: RGOptions = {
    allowSwitchLineShape: true,
    allowSwitchJunctionPoint: true,
    defaultLineColor: "rgba(255, 255, 255, 0.6)",
    defaultNodeColor: "transparent",
    defaultNodeBorderWidth: 0,
    defaultNodeBorderColor: "transparent",
    defaultNodeFontColor: "#ffffff",
    defaultNodeShape: 0,
    toolBarDirection: "h",
    toolBarPositionH: "right",
    toolBarPositionV: "bottom",
    defaultLineShape: 6,
    defaultJunctionPoint: "lr",
    disableNodeClickEffect: true,
    layout: {
      layoutName: "tree",
      from: "left",
      min_per_width: 310,
      min_per_height: 70,
    },
  };

  useEffect(() => {
    showGraph(graphRef.current!);
  }, []);

  return (
    <div style={{ height: 600, width: 900, border: "#efefef solid 1px" }}>
      <div className="h-screen bg-green-500">
        <div className="absolute left-2.5 top-2.5 bg-white bg-opacity-30 rounded-2.5 text-xs text-white p-2.5">
          Fully customize the graphical elements of the graph using div+css, Vue components, and
          React components through slots
          <br />
          Customize the graphical elements of the graph using div+css, Vue components, and React
          components through slots
        </div>
        <RelationGraph ref={graphRef} options={graphOptions} nodeSlot={NodeSlot} />
      </div>
    </div>
  );
};

export default NodeStyle4;
