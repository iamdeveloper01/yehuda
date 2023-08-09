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
import queryString from 'query-string';
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

export const MachineList = () => {
  const navigate = useNavigate();

  const [machines, setMachines] = useState<Mvalues>([]);
  const  state  = useLocation();
  const {type='machines'} = queryString.parse(state.search);

  useEffect(() => {
    void fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response: AxiosResponse = await axios.get(
        `http://localhost:8000/${type}/`
      );
      setMachines(response?.data as Mvalues);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleNavigate = (type: string, data?: values) => {
    navigate(`/form/?formType=${type}&rawData=${type=="update"?JSON.stringify(data): "None"}`)
  };

  return (
    <div>
      <div className="titleHeading">
        <h3 className="heading">Machine List</h3>
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
              {machines?.length ?
                Object.keys(machines[0])
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
            {machines?.map((machine: values) => {
              return (
                <TableRow
                  key={machine?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <>
                    {Object.keys(machine)
                      ?.sort((a, b) => a.length - b.length)
                      .map((value: string) => {
                        return (
                          <TableCell>
                            {machine[value as keyof values]}
                          </TableCell>
                        );
                      })}
                  </>
                  <TableCell>
                    <Button
                      className="buttonContainer"
                      onClick={() => handleNavigate("update", machine)}
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
  )
};