import React from "react";

export interface VisContainerProps {
    width: number;
    height: number;
    children: React.ReactNode;
}

export interface DateValue {
    date: string;
    value: number;
}

export type SparklineData = DateValue[];

export interface SparklineProps {
    width: number;
    height: number;
    data: SparklineData; 
    minDate: string;
}