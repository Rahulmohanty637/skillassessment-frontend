import { Button } from "@/components(shadcn)/ui/button";
import { Input } from "@/components(shadcn)/ui/input";
import { Label } from "@/components(shadcn)/ui/label";
import "./coustom.css";
import React, { useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { coursesData } from "@/Components/Traning Partner/Atoms/courseAtom";
import { sectorData } from "@/Components/Traning Partner/Atoms/sectorAtom";
import { validationSchema } from "@/Components/Traning Partner/utils/validation";
const Signup = () => {
  const inputLabels = [
    "organizationName",
    "password",
    "organizationCategory",
    "centerId",
    "tpCode",
    "scheme",
    "affiliation",
    "dateOfIncorporation",
    "registeredOfficeAddress",
    "registeredOfficeDistrict",
    "registeredOfficeCity",
    "registeredOfficeState",
    "registeredOfficePin",
    "registeredOfficeTelephone",
    "registeredOfficeMobile",
    "registeredOfficeFax",
    "registeredOfficeEmail",
    "registeredOfficeGst",
    "regionalStateOfficeAddress",
    "regionalStateOfficeDistrict",
    "regionalStateOfficeCity",
    "regionalStateOfficeState",
    "regionalStateOfficePin",
    "regionalStateOfficeTelephone",
    "regionalStateOfficeMobile",
    "regionalStateOfficeFax",
    "regionalStateOfficeEmail",
    "regionalStateOfficeGst",
    "website",
    "pan",
    "prnNo",
    "headOwnerName",
    "headOwnerDob",
    "headOwnerCity",
    "headOwnerResidenceAddress",
    "headOwnerPermanentAddress",
    "headOwnerMobile",
    "headOwnerAlternateMobile",
    "headOwnerEmail",
    "headOwnerQualification",
    "headOwnerWorkExperience",
    "headOwnerPanNo",
    "headOwnerAadharNo",
    "headOwnerPromoter1",
    "headOwnerPromoter2",
    "headOwnerPromoter3",
    "projectContactPersonName",
    "projectContactPersonDesignation",
    "projectContactPersonCity",
    "projectContactPersonMobile",
    "projectContactPersonAlternateMobile",
    "projectContactPersonResidenceAddress",
    "projectContactPersonPermanentAddress",
    "projectContactPersonEmail",
    "projectContactPersonAlternateEmail",
    "sector",
    "courses",
    "businessesType",
  ];
  const selectFields = ["sector", "courses", "businessesType"];
  const navigate = useNavigate();
  const TimeLabel = ["dateOfIncorporation", "headOwnerDob", "timestamp"];

  const [currentPage, setCurrentPage] = useState(0);
  const [inputs, setInputs] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 789);
  const inputsPerPage = 20;
  const totalPages = Math.ceil(inputLabels.length / inputsPerPage);
  const [onSubmit, setOnSubmit] = useState(false);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useRecoilState(coursesData);
  const [sectors, setSectors] = useRecoilState(sectorData);
  const [selectedSector, setSelecetdSector] = useState("");


  useEffect(() => {
    // Fetch sectors and courses from API
    fetchSectors();
    
  }, []);



  // fecthing the values of course

  const fetchSectors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/sector/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      setSectors(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // fecthing the courses
  console.log("sectorname", selectedSector);
  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/sector?name=${selectedSector}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {}
  };
  useEffect(()=>{
    fetchCourses();
  },[selectedSector])
  // validation schema
  

  useEffect(() => {
    setOnSubmit(currentPage === totalPages - 1);
  }, [currentPage, totalPages]);

  const currentInputs = inputLabels.slice(
    currentPage * inputsPerPage,
    (currentPage + 1) * inputsPerPage
  );
  const firstColumn = currentInputs.slice(0, 10);
  const secondColumn = currentInputs.slice(10, 20);

  const handleChange = (label, value) => {
    setInputs((prevState) => ({
      ...prevState,
      [label]: value,
    }));
    if (label === "sector") {
      setSelecetdSector(value);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 786);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //  submiting the form
  const handleSubmit = async () => {
    try {
      await validationSchema.validate(inputs, { abortEarly: false });
      const jsondata = JSON.stringify(inputs);

      const response = await fetch("http://localhost:8000/api/v1/tp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsondata,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Form submitted successfully!");
        setInputs({});
        navigate("/trainingPartner/signin");
      } else {
        console.log(data);
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      const newError = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          newError[err.path] = err.message;
        });
        console.log("newerror", newError);
        setErrors(newError);
        console.log("this is store error", errors);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg-black min-h-screen p-10 flex flex-col justify-between">
      <div className="flex justify-center font-extrabold text-lg m-6 text-white">
        Training-Partner-SignUp
      </div>
      <div>
        {isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            <div>
              {firstColumn.map((label, index) => (
                <div key={index} className="text-white">
                  <Label>{label}</Label>
                  {TimeLabel.includes(label) ? (
                    <div className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full">
                    <DatePicker
                      className="w-full bg-transparent text-white"
                      onChange={(date) => handleChange(label, date)}
                      value={inputs[label] || ""}
                    />
                  </div>
                  ) : (
                    <>
                      <Input
                        className="w-full bg-transparent text-white"
                        onChange={(e) => handleChange(label, e.target.value)}
                        value={inputs[label] || ""}
                      />
                      {errors[label] && (
                        <p style={{ color: "red" }}>{errors[label]}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div>
              {secondColumn.map((label, index) => (
                <div key={index} className="text-white">
                  <Label>{label}</Label>
                  {TimeLabel.includes(label) ? (
                   <div className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full">
                   <DatePicker
                     className="w-full bg-transparent text-white"
                     onChange={(date) => handleChange(label, date)}
                     value={inputs[label] || ""}
                   />
                 </div>
                  ) : (
                    <>
                      <Input
                        className="w-full bg-transparent text-white"
                        onChange={(e) => handleChange(label, e.target.value)}
                        value={inputs[label] || ""}
                      />
                      {errors[label] && (
                        <p style={{ color: "red" }}>{errors[label]}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              {firstColumn.map((label, index) => (
                <div key={index} className="text-white">
                  <Label>{label}</Label>
                  {TimeLabel.includes(label) ? (
                     <div className="flex h-10 rounded-md border border-input bg-black px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full">
                     <DatePicker
                       className="w-full"
                       onChange={(date) => handleChange(label, date)}
                       value={inputs[label] || ""}
                     />
                   </div>
                  ) : (
                    <>
                      <Input
                        className="w-full bg-transparent text-white"
                        onChange={(e) => handleChange(label, e.target.value)}
                        value={inputs[label] || ""}
                      />
                      {errors[label] && (
                        <p style={{ color: "red" }}>{errors[label]}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div>
              {secondColumn.map((label, index) => (
                <div key={index} className="text-white">
                  <Label>{label}</Label>
                  {TimeLabel.includes(label) ? (
                    <div className="flex h-10 rounded-md border border-input bg-black px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full">
                      <DatePicker
                        className="w-full"
                        onChange={(date) => handleChange(label, date)}
                        value={inputs[label] || ""}
                      />
                    </div>
                  ) : selectFields.includes(label) ? (
                    <div className=" border rounded-md bg-black">
                      <select
                        className="w-full bg-black text-white p-2 rounded-md"
                        onChange={(e) => handleChange(label, e.target.value)}
                        value={inputs[label] || ""}
                      >
                        {label === "sector" && (
                          <>
                            <option value="">Select a sector</option>
                            {sectors.map((sector, index) => (
                              <option key={index} value={sector.name}>
                                {sector.name}
                              </option>
                            ))}
                          </>
                        )}
                     
                        {label === "courses" &&
                          courses &&
                          courses.length > 0 && (
                            <>
                             <option value="">Select a Course</option>
                              {courses.map((course, index) => (
                                <option key={index} value={course._id}>
                                  
                                  {course.courseName}
                                </option>
                              ))}
                            </>
                          )}

                        {label === "businessesType" && (
                          <>
                            <option value="Type1">Type1</option>
                            <option value="Type2">Type2</option>
                            <option value="Type3">Type3</option>
                          </>
                        )}
                      </select>
                      
                    </div>
                  ) : (
                    <>
                      <Input
                        className="w-full bg-transparent text-white"
                        onChange={(e) => handleChange(label, e.target.value)}
                        value={inputs[label] || ""}
                      />
                      {errors[label] && (
                        <p style={{ color: "red" }}>{errors[label]}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage}>
          {currentPage === totalPages - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Signup;