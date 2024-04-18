function mergeObjects(...objects)
{
  let result = {};
  for(let object of objects)
  {
    for(let key in object)
    {
      if(typeof(object[key]) == "number" && (!(key in result) || typeof(result[key]) == "number"))
        result[key] = object[key] + result[key]??0;
      else
        result[key] = object[key];
    }
  }
  return result;
}
  
export { mergeObjects };
