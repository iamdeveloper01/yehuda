import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import "./index.css";

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

type Mvalues = {
  name: string;
  location: string;
  email: string;
  number: number;
  float_number: number;
  id: number;
  enum: string;
  created_at: string;
  edited_at: string;
}[];

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Mvalues>([]);
  const location  = useLocation();
  const topic =  location.search.replace("?" , "");

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        `http://localhost:8000/${topic}/`
      );
      setData(response?.data as Mvalues);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNavigate = (type: string, data?: values) => {
    navigate(`/form/?formType=${type}&rawData=${type=="update"?JSON.stringify(data): "None"}&topic=${topic}`)
  };

  return (
    <>
    {data.length>0?
    <div className="">
      <div className="noDataText"><h2>{topic?.charAt(0).toUpperCase() + topic?.slice(1)}</h2></div> 
      <div className="titleHeading">
        <h3 className="heading">{topic?.charAt(0).toUpperCase() + topic?.slice(1)} {topic && "List"}</h3>
        <Button
          className="buttonContainer"
          sx={{ height: "35px" }}
          onClick={() => handleNavigate("create")}
          variant="contained"
        >
          Create
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {data?.length ?
                Object.keys(data[0])
                  .sort((a, b) => a.length - b.length)
                  .map((key, index) => {
                    return (
                      <TableCell
                        sx={{ "text-transform": "capitalize" }}
                        key={index}
                      >
                        {key.replace("_", " ")}
                      </TableCell>
                    );
                  }):<></>}
              <TableCell sx={{ "text-transform": "capitalize" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((element: values) => {
              return (
                <TableRow
                  key={element?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <>
                    {Object.keys(element)
                      ?.sort((a, b) => a.length - b.length)
                      .map((value: string) => {
                        return (
                          <TableCell>
                            {element[value as keyof values]}
                          </TableCell>
                        );
                      })}
                  </>
                  <TableCell>
                    <Button
                      className="buttonContainer"
                      onClick={() => handleNavigate("update", element)}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    :
    <div className="noDataText"><h3>You have no data</h3></div>
    }
    </>
  )
};

export default Dashboard;