import newRequest from "../utils/newRequest";

const getPostsByCat = async (cat) => {
  const data = await newRequest.get(`/post/cat/${cat}`);
  // console.log(data);
  return data;
};

export default getPostsByCat;
