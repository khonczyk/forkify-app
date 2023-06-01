import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

///////////////////////////////////////

//Freezing page state (PARCEL) - development
// if (module.hot) {
//   module.hot.accept();
// }

async function controlRecipes() {
  try {
    // 0) Get hash(id) from the URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 1) Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());
    // Upadte bookmarks (they need to be first rendered)
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    recipeView.renderSpiner();
    await model.loadRecipe(id);

    // 3) Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
}

async function controlSearchResults() {
  try {
    resultsView.renderSpiner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load seearch results
    await model.loadSearchResults(query);

    // 3) Render resultsc
    resultsView.render(model.getSearchResultsPage());

    // 4) Render INITIAL pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(`${err} 💥💥`);
  }
}

function controlPagination(goToPage) {
  // 3') Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4') Render NEW pagination buttons
  paginationView.render(model.state.search);
}

function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe View (icon Bookmark)
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
  bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpiner();

    // Upload newRecipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Render success method
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err);
  }
}

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Welcome!');
}
init();
