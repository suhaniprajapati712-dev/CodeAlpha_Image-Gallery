/* =========================================================
   IMAGE GALLERY
   JavaScript
   ========================================================= */


/* ================================
   1. SELECT HTML ELEMENTS
   ================================ */

const galleryItems = document.querySelectorAll(".gallery-item");

const filterButtons = document.querySelectorAll(".filter-btn");

const searchInput = document.getElementById("searchInput");

const clearSearch = document.getElementById("clearSearch");

const imageCount = document.getElementById("imageCount");

const noResults = document.getElementById("noResults");


/* ================================
   LIGHTBOX ELEMENTS
   ================================ */

const lightbox = document.getElementById("lightbox");

const lightboxOverlay =
    document.getElementById("lightboxOverlay");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxDescription =
    document.getElementById("lightboxDescription");

const lightboxCategory =
    document.getElementById("lightboxCategory");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");


/* ================================
   THEME
   ================================ */

const themeBtn =
    document.getElementById("themeBtn");


/* ================================
   2. STORE GALLERY DATA
   ================================ */

const images = Array.from(galleryItems).map((item, index) => {

    const image = item.querySelector("img");

    return {

        index: index,

        src: image.src,

        alt: image.alt,

        title: item.dataset.title,

        description: item.dataset.description,

        category: item.dataset.category

    };

});


/* ================================
   3. VARIABLES
   ================================ */

let currentIndex = 0;

let activeCategory = "all";

let searchTerm = "";


/* Favorites
   We use localStorage so favorites
   remain even after refreshing.
*/

let favorites =
    JSON.parse(localStorage.getItem("galleryFavorites")) || [];


/* ================================
   4. DISPLAY FAVORITES
   ================================ */

function updateFavoriteButtons() {

    document
        .querySelectorAll(".favorite-btn")
        .forEach(button => {

            const index =
                Number(button.dataset.index);

            if (favorites.includes(index)) {

                button.textContent = "♥";

                button.classList.add("favorited");

            } else {

                button.textContent = "♡";

                button.classList.remove("favorited");

            }

        });

}


/* ================================
   5. FILTER GALLERY
   ================================ */

function filterGallery() {

    let visibleCount = 0;


    galleryItems.forEach((item, index) => {

        const category =
            item.dataset.category.toLowerCase();

        const title =
            item.dataset.title.toLowerCase();

        const description =
            item.dataset.description.toLowerCase();


        /* Category check */

        let categoryMatch = false;


        if (activeCategory === "all") {

            categoryMatch = true;

        }

        else if (activeCategory === "favorites") {

            categoryMatch =
                favorites.includes(index);

        }

        else {

            categoryMatch =
                category === activeCategory;

        }


        /* Search check */

        const searchMatch =

            title.includes(searchTerm) ||

            description.includes(searchTerm) ||

            category.includes(searchTerm);


        /* Final check */

        if (categoryMatch && searchMatch) {

            item.style.display = "block";

            visibleCount++;

        } else {

            item.style.display = "none";

        }

    });


    /* Update image counter */

    imageCount.textContent = visibleCount;


    /* No results */

    if (visibleCount === 0) {

        noResults.classList.add("show");

    } else {

        noResults.classList.remove("show");

    }


    /* Update clear button */

    if (searchTerm.length > 0) {

        clearSearch.style.display = "block";

    } else {

        clearSearch.style.display = "none";

    }

}


/* ================================
   6. FILTER BUTTON EVENTS
   ================================ */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {


        /* Remove active class */

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        /* Add active class */

        button.classList.add("active");


        /* Get category */

        activeCategory =
            button.dataset.category;


        /* Apply filter */

        filterGallery();

    });

});


/* ================================
   7. SEARCH FUNCTION
   ================================ */

searchInput.addEventListener("input", () => {

    searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    filterGallery();

});


/* ================================
   8. CLEAR SEARCH
   ================================ */

clearSearch.addEventListener("click", () => {

    searchInput.value = "";

    searchTerm = "";

    filterGallery();

    searchInput.focus();

});


/* ================================
   9. OPEN LIGHTBOX
   ================================ */

function openLightbox(index) {

    currentIndex = index;


    const image =
        images[currentIndex];


    /* Set image */

    lightboxImage.src =
        image.src;


    lightboxImage.alt =
        image.alt;


    /* Set details */

    lightboxTitle.textContent =
        image.title;


    lightboxDescription.textContent =
        image.description;


    lightboxCategory.textContent =
        image.category;


    /* Show lightbox */

    lightbox.classList.add("active");

    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    /* Prevent background scrolling */

    document.body.style.overflow = "hidden";

}


/* ================================
   10. CLOSE LIGHTBOX
   ================================ */

function closeLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    /* Restore scrolling */

    document.body.style.overflow = "";

}


/* ================================
   11. NEXT IMAGE
   ================================ */

function showNextImage() {

    currentIndex++;


    /* Loop back to first image */

    if (currentIndex >= images.length) {

        currentIndex = 0;

    }


    updateLightbox();

}


/* ================================
   12. PREVIOUS IMAGE
   ================================ */

function showPreviousImage() {

    currentIndex--;


    /* Loop to last image */

    if (currentIndex < 0) {

        currentIndex =
            images.length - 1;

    }


    updateLightbox();

}


/* ================================
   13. UPDATE LIGHTBOX
   ================================ */

function updateLightbox() {

    const image =
        images[currentIndex];


    lightboxImage.src =
        image.src;


    lightboxImage.alt =
        image.alt;


    lightboxTitle.textContent =
        image.title;


    lightboxDescription.textContent =
        image.description;


    lightboxCategory.textContent =
        image.category;

}


/* ================================
   14. VIEW IMAGE BUTTON
   ================================ */

document
    .querySelectorAll(".view-btn")
    .forEach(button => {

        button.addEventListener("click", event => {

            /*
                Prevent the gallery card
                click from interfering.
            */

            event.stopPropagation();


            const index =
                Number(button.dataset.index);


            openLightbox(index);

        });

    });


/* ================================
   15. CLICK IMAGE
   ================================ */

galleryItems.forEach((item, index) => {

    item.addEventListener("click", event => {


        /*
            Don't open lightbox if
            favorite button was clicked.
        */

        if (
            event.target.closest(".favorite-btn")
        ) {

            return;

        }


        openLightbox(index);

    });

});


/* ================================
   16. NEXT BUTTON
   ================================ */

nextBtn.addEventListener(
    "click",
    showNextImage
);


/* ================================
   17. PREVIOUS BUTTON
   ================================ */

prevBtn.addEventListener(
    "click",
    showPreviousImage
);


/* ================================
   18. CLOSE BUTTON
   ================================ */

lightboxClose.addEventListener(
    "click",
    closeLightbox
);


/* ================================
   19. CLICK OUTSIDE IMAGE
   ================================ */

lightboxOverlay.addEventListener(
    "click",
    closeLightbox
);


/* ================================
   20. KEYBOARD CONTROLS
   ================================ */

document.addEventListener("keydown", event => {


    /* Only work when lightbox is open */

    if (!lightbox.classList.contains("active")) {

        return;

    }


    /* Arrow Right */

    if (event.key === "ArrowRight") {

        showNextImage();

    }


    /* Arrow Left */

    if (event.key === "ArrowLeft") {

        showPreviousImage();

    }


    /* Escape */

    if (event.key === "Escape") {

        closeLightbox();

    }

});


/* ================================
   21. FAVORITE BUTTON
   ================================ */

document
    .querySelectorAll(".favorite-btn")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();


            const index =
                Number(button.dataset.index);


            /* Already favorite */

            if (favorites.includes(index)) {

                favorites =
                    favorites.filter(
                        favoriteIndex =>
                            favoriteIndex !== index
                    );

            }

            /* Add favorite */

            else {

                favorites.push(index);

            }


            /* Save */

            localStorage.setItem(
                "galleryFavorites",
                JSON.stringify(favorites)
            );


            /* Update buttons */

            updateFavoriteButtons();


            /*
                If Favorites category
                is currently active,
                refresh gallery.
            */

            if (
                activeCategory === "favorites"
            ) {

                filterGallery();

            }

        });

    });


/* ================================
   22. THEME TOGGLE
   ================================ */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-theme"
    );


    const isLight =
        document.body.classList.contains(
            "light-theme"
        );


    /* Change icon */

    if (isLight) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";

    }


    /* Save theme */

    localStorage.setItem(
        "galleryTheme",
        isLight ? "light" : "dark"
    );

});


/* ================================
   23. LOAD SAVED THEME
   ================================ */

const savedTheme =
    localStorage.getItem("galleryTheme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeBtn.textContent = "☀️";

}


/* ================================
   24. INITIALIZE
   ================================ */

updateFavoriteButtons();

filterGallery();