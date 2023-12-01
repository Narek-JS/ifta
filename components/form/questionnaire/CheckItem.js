import React, { useMemo } from "react";
import { MultipleSelectCheckmarks } from "@/components/universalUI/MultipleSelectCheckmarks";
import Fade from "react-reveal/Fade";

const CheckItem = ({ states, checks, setChecks, dataIndex }) => {

  const items = useMemo(() => {
    return states.sort();
  }, [states]);

  return (
    <Fade>
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
    </Fade>
  );
};

export default CheckItem;