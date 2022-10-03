const uploadbtn = document.querySelectorAll("#upload");

uploadbtn?.forEach((d) => {
  d?.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "/upload";
  });
});
