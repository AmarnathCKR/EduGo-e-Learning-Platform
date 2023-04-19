const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { Instructor } = require("../../database/Instructor");
const { Course } = require("../../database/Course");
const { Admin } = require("../../database/Admin");
const { FieldCategory } = require("../../database/FieldCategory");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

exports.createFields = async (req, res) => {
  const { name, tag, image } = req.body;
  console.log(req.body);
  if (req.body) {
    new FieldCategory({
      name: name,
      tag: tag,
      image: image,
    })
      .save()
      .then((result) => {
        const success = {
          status: true,
          content: {
            data: result,
          },
        };
        res.status(200).send({ data: success });
      });
  } else {
    const emailError = {
      status: false,
      errors: [
        {
          param: "no inputs",
          message: "No data received",
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
};

exports.fetchAllFields = async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;
  const sortField = req.query.sortField || "name";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const searchText = req.query.searchText || "";

  const skip = (page - 1) * pageSize;

  const filter = {
    $or: [{ name: { $regex: searchText, $options: "i" } }],
  };

  const totalCount = await FieldCategory.countDocuments(filter);

  const data = await FieldCategory.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(pageSize)
    .exec();

    console.log(data.length)

  const result = await data.map((item) => {
    return { id: item._id, image: item.image, name: item.name, tag: item.tag ,ref : item._id};
  });

  res.json({
    items: result,
    totalCount: totalCount,
  });
};

exports.deleteField = async (req,res) =>{
  const {id} = req.query;
  await FieldCategory.findByIdAndDelete(id).then((result)=>{
    const success = {
      status: true,
      content: {
        data: result,
      },
    };
    res.status(200).send({ data: success });
  }).catch((err)=>{
    console.log(err)
  })
}

exports.getField = async (req,res) => {
  const {id} = req.query;
  
  const data = await FieldCategory.findOne({_id : id})
  if(data){
    const success = {
      status: true,
      content: {
        data: data,
      },
    };
    res.status(200).send({ data: success });
  }else{
    const emailError = {
      status: false,
      errors: [
        {
          param: "Invalid id",
          message: "No fields found",
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }

}


exports.editField = async (req,res) => {
  const {id} = req.query;
  const {name, tag, image} = req.body;
  await FieldCategory.findByIdAndUpdate(id,{
    name : name,
    tag : tag,
    image : image
  }).then((response)=>{
    const success = {
      status: true,
      content: {
        data: "data updated",
      },
    };
    res.status(200).send({ data: success });
  }).catch((err)=>{
    const emailError = {
      status: false,
      errors: [
        {
          param: "Invalid id",
          message: "No fields found",
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  })
}

exports.getAllCourse = async (req,res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 100;
  const sortField = req.query.sortField || "name";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const searchText = req.query.searchText || "";

  const skip = (page - 1) * pageSize;

  const filter = {
    $or: [{ name: { $regex: searchText, $options: "i" } }],
  };

  const totalCount = await Course.countDocuments(filter);

  const data = await Course.find(filter).populate("instructor")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(pageSize)
    .exec();

    console.log(data.length)
    
  const result = await data.map((item) => {
    
    return { image: item.image, name: item.name, instructor: item.instructor.name, headline: item.headline ,id : item._id, status : item.status};
  });

  res.json({
    items: result,
    totalCount: totalCount,
  });
}


exports.getCourseData = async (req,res) => {
  const {id} = req.query;
  
  const data = await Course.findOne({_id : id}).populate("instructor").populate("field")
  if(data){
    console.log(data)
    const success = {
      status: true,
      content: {
        data: data,
      },
    };
    res.status(200).send({ data: success });
  }else{
    const emailError = {
      status: false,
      errors: [
        {
          param: "Invalid id",
          message: "No fields found",
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }

}

exports.changeCourse = async (req, res)=>{
  const {id, status}= req.body;
  await Course.findByIdAndUpdate(id,{
    status : status
  }).then((response)=>{
    
    const success = {
      status: true,
      content: {
        data: response,
      },
    };
    res.status(200).send({ data: success });
  }).catch((err)=>{
    const emailError = {
      status: false,
      errors: [
        {
          param: "Invalid id",
          message: err,
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  })
}