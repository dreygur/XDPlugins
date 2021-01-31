const accordion = list => {
  list.querySelector(".toggle").addEventListener("click", e => {
    if (list.classList.contains("collapsed")) {
      e.target.innerHTML = "▼";
      list.classList.remove("collapsed");
    } else {
      e.target.innerHTML = "▶";
      list.classList.add("collapsed");
    }
  });
};

module.exports = accordion;
