// src/components/LayoutWrapper.tsx
import React from "react";
import Layout from "@/components/layout/Layout";

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Layout>{children}</Layout>;
};

export default LayoutWrapper;
