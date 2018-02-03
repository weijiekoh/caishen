const formatDate = timestamp => {
  const months = ["January", "February", "March", 
                  "April", "May", "June",
                  "July", "August", "September",
                  "October", "November", "December"];

  const d = new Date(timestamp.getTime() * 1000);
  const year = d.getFullYear().toString();
  const month = months[d.getMonth()];
  const day = d.getDate().toString();

  return day + " " + month + " " + year;
}

export { formatDate };
