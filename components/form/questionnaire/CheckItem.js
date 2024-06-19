import React, { useMemo } from "react";
import { MultipleSelectCheckmarks } from "@/components/universalUI/MultipleSelectCheckmarks";

const CheckItem = ({ states, checks, setChecks, dataIndex }) => {

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