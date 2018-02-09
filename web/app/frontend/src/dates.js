const formatDate = (timestamp, isZh) => {
  const d = new Date(timestamp.getTime() * 1000);
  const year = d.getFullYear();
  const month = months[d.getMonth()];
  const day = d.getDate();
  if (isZh){
    return year.toString() + "年" +
          (d.getMonth() + 1).toString() + "月" + 
          day.toString() + "日";
  }
  else{
    const months = ["January", "February", "March", 
                    "April", "May", "June",
                    "July", "August", "September",
                    "October", "November", "December"];


    return day.toString() + " " + month + " " + year.toString();
  }
}

export { formatDate };
