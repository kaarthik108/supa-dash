import Link from "next/link";
import React from "react";

function Keyword({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto text-center flex flex-col items-center justify-center h-full mt-28">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        <span className="text-blue-600">Data Visualization</span> for{" "}
        <span className="text-green-600">Campaign</span> and{" "}
        <span className="text-purple-600">Subscriber Analysis</span>
      </h1>
      <p className="text-lg mb-12 max-w-3xl text-gray-600">
        Our project focuses on <Keyword>data visualization</Keyword> for
        analyzing <Keyword>campaign</Keyword> and <Keyword>subscriber</Keyword>{" "}
        datasets. Through <Keyword>interactive visualizations</Keyword>, we aim
        to uncover <Keyword>insights</Keyword> and <Keyword>patterns</Keyword>{" "}
        that drive campaign success and subscriber engagement. By leveraging{" "}
        <Keyword>data analytics</Keyword> and{" "}
        <Keyword>visualization techniques</Keyword>, we empower businesses to
        make <Keyword>data-driven decisions</Keyword> and optimize their{" "}
        <Keyword>marketing strategies</Keyword>.
      </p>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Who We Are</h2>
      <p className="text-lg mb-12 max-w-3xl text-gray-600">
        We are a team of four <Keyword>data professionals</Keyword> based in{" "}
        <span className="text-blue-600">Auckland, NZ</span>. The team members
        are{" "}
        <Link
          href="https://www.linkedin.com/in/kaarthik-andavar-b32a27143/"
          prefetch={false}
          target="_blank"
        >
          <Keyword>
            <span className="text-indigo-600">Kaarthik Andavar</span>
          </Keyword>
        </Link>
        ,{" "}
        <Link
          href="https://www.linkedin.com/in/olivia-yang-69781b132/"
          prefetch={false}
          target="_blank"
        >
          <Keyword>
            <span className="text-pink-600">Olivia Yang</span>
          </Keyword>
        </Link>
        ,{" "}
        <Link
          href="https://www.linkedin.com/in/thecrypticanalyst"
          prefetch={false}
          target="_blank"
        >
          <Keyword>
            <span className="text-orange-600">Mohit Saini</span>
          </Keyword>
        </Link>
        , and{" "}
        <Link
          href="https://www.linkedin.com/in/ding-wang-akl/"
          prefetch={false}
          target="_blank"
        >
          <Keyword>
            <span className="text-teal-600">Ding Wang</span>
          </Keyword>
        </Link>
        . We are dedicated to harnessing the power of data for{" "}
        <Keyword>actionable insights</Keyword>. With expertise in{" "}
        <Keyword>data engineering</Keyword>, <Keyword>analysis</Keyword>, and{" "}
        <Keyword>visualization</Keyword>, we bring a unique blend of skills to
        transform complex datasets into{" "}
        <Keyword>meaningful visual narratives</Keyword>. Our passion lies in
        helping businesses unlock the full potential of their data and drive
        growth through <Keyword>informed strategies</Keyword>.
      </p>
    </div>
  );
}
