(function ($) {
  $.ajaxSetup({
    headers: {
      "X-CSRF-Token": Joomla.getOptions("csrf.token"),
    },
  });
})(jQuery);

template = "ajyal";

jQuery(function ($) {
  var addonId = $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5"),
    prentSectionId = addonId.parent().closest("section");

  if (
    $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5").find(
      ".optintype-popup"
    ).length !== 0 &&
    $("body:not(.layout-edit)").length !== 0
  ) {
    //prentSectionId.hide();
    $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5").hide();
  }

  if (
    $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5").find(
      ".optintype-popup"
    ).length !== 0 &&
    $("body:not(.layout-edit)").length !== 0
  ) {
    //var parentSection 	= $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5").parent().closest("section"),
    var addonWidth = addonId.parent().outerWidth(),
      optin_timein = 2000,
      optin_timeout = 10000,
      prentSectionId =
        ".com-sppagebuilder:not(.layout-edit) #" + addonId.attr("id");

    window.addEventListener("load", () => {
      setTimeout(() => {
        $("#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5").show();
        $.magnificPopup.open({
          items: {
            src:
              '<div class="sppb-optin-form-popup-wrap" ">' +
              $(addonId)[0].outerHTML +
              "</div>",
            //src: "<div style=\"width:+"addonWidth"+\">" + $(addonId)[0].outerHTML + "</div>"
          },
          type: "inline",
          mainClass: "mfp-fade",
          disableOn: function () {
            return true;
          },
          callbacks: {
            open: () => {
              if (optin_timeout) {
                setTimeout(() => {
                  $(
                    "#sppb-addon-9a59220d-1edf-40f7-883b-60d14b2a15d5"
                  ).magnificPopup("close");
                }, optin_timeout);
              }
            },

            close: () => {
              $(
                "#sppb-addon-wrapper-9a59220d-1edf-40f7-883b-60d14b2a15d5"
              ).hide();
            },
          },
        });
      }, optin_timein);
    }); //window
  }
});


