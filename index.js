const fs = require("fs");

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

// get the data from json file

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(4000, () => {
  console.log("listening at port:3000");
});

// get data

app.get("/", (req, res) => {
  fs.readFile("./hospitaldatas.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      res.send(data);
    }
  });
});

app.get(`/data/:id`, (req, res) => {
  fs.readFile("./hospitaldatas.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      res.send(JSON.parse(data).data.filter((el) => el.id == req.params.id));
    }
  });
});

app.post("/adddata", (req, res) => {
  let data = fs.readFileSync("./hospitaldatas.json", "utf8");
  let myObject = JSON.parse(data);
  const { patient_count, hospital_name, hospital_location } = req.body;
  let newData = {
    id: parseInt(myObject.data.slice(-1)[0].id) + 1,
    patient_count: patient_count,
    hospital_name: hospital_name,
    hospital_location: hospital_location,
  };
  myObject.data.push(newData);
  var newData2 = JSON.stringify(myObject);
  fs.writeFileSync("./hospitaldatas.json", newData2);
  res.send({data:newData,msg:"success"})
});

app.put(`/edit/:id`, (req, res) => {
  let datas = fs.readFileSync("./hospitaldatas.json", "utf8");
  let data = JSON.parse(datas);
  const id = req.params.id;
  const userdata = req.body;
  console.log("userdata", userdata);
  const finddata = data.data.find((element) => element.id == req.params.id);
  console.log("find1", finddata);
  if (finddata) {
    (finddata.patient_count = userdata.patient_count),
      (finddata.hospital_location = userdata.hospital_location),
      (finddata.hospital_name = userdata.hospital_name);
  } else {
    res.send({ success: false, msg: "username does not exist" });
  }
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("./hospitaldatas.json", stringifyData);
  res.send({ success: true, msg: "User data updated successfully" });
});

app.delete(`/delete/:id`, (req, res) => {
  let datas = fs.readFileSync("./hospitaldatas.json", "utf8");
  let data = JSON.parse(datas);
  const id = req.params.id;
  const finddata = data.data.find((element) => element.id == id);
  delete data.data[data.data.indexOf(finddata)]
  fs.writeFileSync("./hospitaldatas.json", JSON.stringify(data));
  res.send({msg:`accounts with id ${id} has been deleted`,data:finddata});
});
