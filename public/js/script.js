// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
   "use strict";

   // Fetch all the forms we want to apply custom Bootstrap validation styles to
   const forms = document.querySelectorAll(".needs-validation");

   // Loop over them and prevent submission
   Array.from(forms).forEach((form) => {
      form.addEventListener(
         "submit",
         (event) => {
            if (!form.checkValidity()) {
               event.preventDefault();
               event.stopPropagation();
            }

            form.classList.add("was-validated");
         },
         false
      );
   });
})();

// Tax Price 
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    let originalPrices = document.getElementsByClassName("original-price");
    let taxPrices = document.getElementsByClassName("price-with-tax");

    for (let i = 0; i < originalPrices.length; i++) {
      if (taxSwitch.checked) {
        originalPrices[i].style.display = "none";
        taxPrices[i].style.display = "inline";
      } else {
        originalPrices[i].style.display = "inline";
        taxPrices[i].style.display = "none";
      }
    }
  });