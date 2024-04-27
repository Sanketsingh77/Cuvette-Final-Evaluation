const handleErrorResponse = (res, error) => {
  if (error.details) {
    return res.status(400).send(error.details);
  } else {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { handleErrorResponse };
