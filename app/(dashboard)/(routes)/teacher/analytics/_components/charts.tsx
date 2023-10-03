"use client";

import React from 'react'
import { Card } from '@/components/ui/card';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';

interface ChartsProps {
data : {
 name : string;
 total : number;
}[]
}

export default function Charts({data} : ChartsProps) {
  return (
    <Card>
        <ResponsiveContainer width={"100%"} height={350}>
            <BarChart data={data}>
                <XAxis dataKey={"name"} stroke='#888888' fontSize={12} tickLine={false} axisLine={false}  />
                <YAxis  stroke='#888888'
                 fontSize={12}
                  tickLine={false}
                   axisLine={false}
                 tickFormatter={(value) => `$${value}`} />
                 <Bar dataKey={"total"} fill='#0369a1' radius={[4,4,0,0]}/>
            </BarChart>
        </ResponsiveContainer>
    </Card>
  )
}
