/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import axios from "axios";
import queryString from 'query-string';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const SmartForm = () => {
  const [schema, setSchema] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  const navigate = useNavigate();
  const state = useLocation();
  const {formType, rawData, topic} = queryString.parse(state.search);
  
  useEffect(()=>{
  if(rawData?.length && formType === 'update'){
    setFormData(JSON.parse(rawData as string))
  }
  if(formType){
    fetchSchema(formType as 'create'|'update')
  }

  },[rawData, formType])

  
  const fetchSchema = async (type: 'create'|'update') => {
    try {
      const response = await axios.get(
        `http://localhost:8000/${topic}/schema/${type}`
      );      
      setSchema(JSON.parse(response.data as unknown as string));

    if(type==='create')  setFormData(response?.data);
    } catch (error) {
      console.error("Error fetching form schema:", error);
    }
  };

  const handleCreate = async (payload: any) => {
    try {
      await axios.post(`http://localhost:8000/${topic}/create/`, payload);
      alert("Created successfully!");
      navigate(-1);
      setFormData({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleUpdate = async (payload: any) => {
    try {
      await axios.put(
        `http://localhost:8000/${topic}/update/${formData.id}/`,
        payload
      );
      alert("Updated successfully!");
      navigate(-1);
      setFormData({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const obj: any = {};

    [...e.target].forEach((i: any) => {
      if (i.name && i.value) {
        obj[i.name] = i.value;
      }
    });

    if (formType === "create") {
      void handleCreate(obj);
    } else {
      void handleUpdate(obj);
    }
  };

  return (
    <div className="formMainContainer">
      <h3>
        {formType?.charAt(0).toUpperCase() + formType?.slice(1)} {topic?.charAt(0).toUpperCase() + topic?.slice(1)}
      </h3>
      <form onSubmit={handleSubmit}>
        {schema?.properties &&
          Object.entries(schema?.properties).map(
            ([fieldName, fieldData]: [string, any]) => {

              const {
                type,
                readOnly,
                default: defaultValue,
                enum: enumOptions,
              } = fieldData;
              let value = formType === "update"?formData[fieldName]:defaultValue;
              
              const isRequired =
                schema.required && schema.required.includes(fieldName);
              const fieldId = `${formType}-${fieldName}`;

              return (
                <div
                  key={fieldName}
                  className="container"
                  style={{
                    margin: "12px 0px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "300px",
                  }}
                >
                  <label
                    htmlFor={fieldId}
                    style={{ textTransform: "capitalize" }}
                  >
                    {fieldName.replace("_", " ")} {isRequired && <span>*</span>}
                  </label>
                  {type === "boolean" ? (
                    <input
                      type="checkbox"
                      id={fieldId}
                      name={fieldName}
                      defaultChecked={value}
                    />
                  ) : type === "string" && enumOptions ? (
                    <select id={fieldId} name={fieldName}>
                      {(enumOptions as string[]).map((option: string) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={
                        type === "integer" || type === "number"
                          ? "number"
                          : "text"
                      }
                      id={fieldId}
                      name={fieldName}
                      defaultValue={value}
                      readOnly={readOnly}
                    />
                  )}
                </div>
              );
            }
          )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            className="buttonContainer"
            sx={{ height: "25px" }}
            variant="contained"
          >
            {formType}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default SmartForm;