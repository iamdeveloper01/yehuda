/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

interface SmartFormProps {
  topic?: string;
}

type values = {
  name: string;
  location: string;
  email: string;
  number: number;
  float_number: number;
  id: number;
  enum: string;
  created_at: string;
  edited_at: string;
};

type stateProps = {
  type: string;
  data: values;
};

export const SmartForm = ({ topic = "Machine" }: SmartFormProps) => {
  const [schema, setSchema] = useState<any>({});
  const [formData, setFormData] = useState<any>({});

  const navigate = useNavigate();
  const { state }: stateProps = useLocation();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost/machine/get/${state.data.id}/`
      );

      setFormData(response?.data);
    } catch (error) {
      console.error("Error fetching form schema:", error);
    }
  };

  const fetchSchema = async () => {
    try {
      const response = await axios.get(
        `http://localhost/machine/schema/${
          state?.type === "create" ? "create" : "update"
        }`
      );
      setSchema(JSON.parse(response.data as unknown as string));

      setFormData(response?.data);
    } catch (error) {
      console.error("Error fetching form schema:", error);
    }
  };

  useEffect(() => {
    fetchSchema();
    if (state?.type === "edit") {
      void fetchData();
    }
  }, []);

  const handleCreate = async (payload: any) => {
    try {
      await axios.post("http://localhost/machine/create", payload);
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
        `http://localhost/machine/update/${state.data.id}/`,
        payload
      );
      alert("Updated successfully!");
      navigate(-1);
      setFormData({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const obj = {};

    [...e.target].forEach((i) => {
      if (i.name && i.value) {
        obj[i.name] = i.value;
      }
    });

    if (state.type === "create") {
      void handleCreate(obj);
    } else {
      void handleUpdate(obj);
    }
  };

  return (
    <div className="formMainContainer">
      <h3>
        {state?.type === "create" ? "Create" : "Edit"} {topic}
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
              let value = defaultValue;
              if (state.type === "edit") {
                value = formData[fieldName];
              }
              const isRequired =
                schema.required && schema.required.includes(fieldName);
              const fieldId = `${state?.type}-${fieldName}`;

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
            className="buttonContainer"
            sx={{ height: "25px" }}
            variant="contained"
          >
            {state?.type === "create" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
};
