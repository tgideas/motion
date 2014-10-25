/*global document */
(function() {

	// označení aktivní položky v levém menu podle URL

	var temp = location.href.split("/"),
		currentPage = temp[temp.length - 1];

	var currentLink = $("#nav a[href='" + currentPage + "']");
	if(currentLink.length) {
		currentLink.addClass("current");
	}

	// ukládání pozice posuvníku levého menu

	if(window.localStorage) {
		$("#nav").scroll(function(event) {
			window.localStorage.setItem("navScrollTop", $("#nav").prop("scrollTop"));
		});

		$("#nav").prop("scrollTop", window.localStorage.getItem("navScrollTop"));
	}


	// filtrování metod

	var methods = $(".methods");
	var filterInputs = methods.find(".filter input");

	methods.find(".more").each(function(index, moreElement) {
		var element = $(moreElement);
		element.hide();
		var td = element.closest("td");
		td.wrapInner('<div style="position:relative">').find("div:first-child").prepend('<span class="arrow">');

	});

	// přidání odpovídajících metod k položkám filtru
	// v případě nenalezení zdeaktivuje možnost volby položky filtru

	filterInputs.filter("[data-class]").each(function() {
		var input = $(this),
			count = methods.find(".method." + input.data("class")).length,
			label = input.closest("label");

		label.append(" <small>(" + count + ")</small>");

		if(count === 0) {
			input.prop("disabled", true);
			input.prop("checked", false);
			label.addClass("disabled");
		}
	});

	filterInputs.change(function() {
		methods.toggleClass("hide-" + $(this).data("class"));
	});


	// otevření detailu metody

	$("table").on("click", "tr", function(event) {
		var tr = $(this),
			target = $(event.target);
		if(target.closest(".more").length) {
			if(!target.is("a")) {
				event.preventDefault();
			}
		} else {
			tr.find(".more").slideToggle(function() {

				var element = $(this),
					td = element.closest("td"),
					classOpen = "open";

				if(element.is(":visible")) {
					td.addClass(classOpen);
				} else {
					td.removeClass(classOpen);
				}
			});
		}
	});


})();
