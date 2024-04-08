import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <div className="container mx-auto text-center flex flex-col items-center justify-center h-full mt-28">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        <span className="text-blue-600">Data Visualization</span> for{" "}
        <span className="text-green-600">Campaign</span> and{" "}
        <span className="text-purple-600">Subscriber Analysis</span>
      </h1>
      <p className="text-lg mb-12 max-w-3xl text-gray-600">
        Our project focuses on <Badge>data visualization</Badge> for analyzing{" "}
        <Badge>campaign</Badge> and <Badge>subscriber</Badge> datasets. Through{" "}
        <Badge>interactive visualizations</Badge>, we aim to uncover{" "}
        <Badge>insights</Badge> and <Badge>patterns</Badge> that drive campaign{" "}
        success and subscriber engagement. By leveraging{" "}
        <Badge>data analytics</Badge> and{" "}
        <Badge>visualization techniques</Badge>, we empower businesses to make{" "}
        <Badge>data-driven decisions</Badge> and optimize their{" "}
        <Badge>marketing strategies</Badge>.
      </p>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Who We Are</h2>
      <p className="text-lg mb-12 max-w-3xl text-gray-600">
        We are a team of four <Badge>data professionals</Badge> based in{" "}
        <span className="text-blue-600">Auckland, NZ</span>. The team members
        are{" "}
        <Link
          href="https://www.linkedin.com/in/kaarthik-andavar-b32a27143/"
          prefetch={false}
          target="_blank"
        >
          <Badge variant={"secondary"}>
            <span className="text-indigo-600">Kaarthik Andavar</span>
          </Badge>
        </Link>
        ,{" "}
        <Link
          href="https://www.linkedin.com/in/olivia-yang-69781b132/"
          prefetch={false}
          target="_blank"
        >
          <Badge variant={"secondary"}>
            <span className="text-pink-600">Olivia Yang</span>
          </Badge>
        </Link>
        ,{" "}
        <Link
          href="https://www.linkedin.com/in/thecrypticanalyst"
          prefetch={false}
          target="_blank"
        >
          <Badge variant={"secondary"}>
            <span className="text-orange-600">Mohit Saini</span>
          </Badge>
        </Link>
        , and{" "}
        <Link
          href="https://www.linkedin.com/in/ding-wang-akl/"
          prefetch={false}
          target="_blank"
        >
          <Badge variant={"secondary"}>
            <span className="text-teal-600">Ding Wang</span>
          </Badge>
        </Link>
        . We are dedicated to harnessing the power of data for{" "}
        <Badge>actionable insights</Badge>. With expertise in{" "}
        <Badge>data engineering</Badge>, <Badge>analysis</Badge>, and{" "}
        <Badge>visualization</Badge>, we bring a unique blend of skills to{" "}
        transform complex datasets into{" "}
        <Badge>meaningful visual narratives</Badge>. Our passion lies in helping
        businesses unlock the full potential of their data and drive growth
        through <Badge>informed strategies</Badge>.
      </p>
    </div>
  );
}
