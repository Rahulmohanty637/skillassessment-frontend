import { server } from "@/main";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DataTable } from "../notiification/DataTable";
import { cn } from "@/lib/utils";


const TraningPartner = () => {
  const [traningPartnerData, setTraningPartnerData] = useState([]);
  const [loding, setLoding] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  useEffect(() => {
    try {
      setLoding(true);
      axios
        .get(`${server}/tp/status/approved`, {
          withCredentials: true,
        })
        .then((response) => {
          setLoding(false);
          setTraningPartnerData(response.data.data.reverse());
          setIsDataFetched(true);
        });
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  }, [isDataFetched]);
  return (
    <div>
      <DataTable
        filter1={"organizationName"}
        path={"/admin/dasbord/TreaningPartner"}
        columns={columns}
        data={traningPartnerData && traningPartnerData}
        isLoding={loding}
      />
    </div>
  );
};

export default TraningPartner;

const columns = [
  {
    accessorKey: "organizationName",
    header: "Traning Partner Name",
  },
  {
    accessorKey: "registeredOfficeEmail",
    header: "Email",
  },
  {
    accessorKey: "registeredOfficeState",
    header: "State",
  },
  {
    accessorKey: "scheme",
    header: "Scheme",
  },
  {
    accessorKey: "applicationStatus",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div
          className={cn("font-medium w-fit px-4 py-2 rounded-lg", {
            "bg-red-100 text-red-500":
              row.getValue("applicationStatus") === "Rejected",
            "bg-orange-100 text-orange-500":
              row.getValue("applicationStatus") === "Pending",
            "bg-green-100 text-green-400":
              row.getValue("applicationStatus") === "Approved",
          })}
        >
          {row.getValue("applicationStatus")}
        </div>
      );
    },
  },
];
