import { MultipleSelectCheckmarks } from "@/components/universalUI/MultipleSelectCheckmarks";
import { useMemo } from "react";

const CheckItem = ({ states, checks, setChecks, dataIndex }) => {

  // Memoize the sorted states to prevent unnecessary re-sorting on each render.
  const items = useMemo(() => {
    return states.sort();
  }, [states]);

  return (
    <div className="checkItem">
      <p className="primary weight500 line24 mb5">
        Jurisdiction<sup className="red"> *</sup>
      </p>
      <MultipleSelectCheckmarks
        items={items}
        setChecks={setChecks}
        checks={checks}
        dataIndex={dataIndex}
      />
    </div>
  );
};

export default CheckItem;