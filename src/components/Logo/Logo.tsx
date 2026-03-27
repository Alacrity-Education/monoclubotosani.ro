import clsx from "clsx";
import React from "react";

interface Props {
  className?: string;
  loading?: "lazy" | "eager";
  priority?: "auto" | "high" | "low";
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
  } = props;

  const loading = loadingFromProps || "lazy";
  const priority = priorityFromProps || "low";

  return (
    /* eslint-disable @next/next/no-img-element */
      <div 
        className={clsx(
          "text-lg lg:text-xl font-semibold",
          className,
        )}
       
      > Monoclu Botosani </div>
     
  );
};
