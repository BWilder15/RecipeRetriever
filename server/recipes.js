module.exports.init = function(app,pool){

  
  // Accept a recipe name, description, and a list of ingredient IDs.  We trust the client to give us
  // correct ingredient ids and amounts.
  // {name: "Hot Chocolate", description: "A lovely beverage for snowy evenings", ingredients: [(2,5.3), (4,1.1), ...]  }
  app.post('/recipes', function (request, response) {
    if(request.query.name &&
    request.query.description &&
    request.query.ingredients){
      // TODO: Why do a set if it already there?
      const insertRecipesQuery = `INSERT INTO Recipes (Name, Description) values ($1, $2)`
      const insertRecipesData = [request.query.name, request.query.description]

      // if this is done in the background, the for loop may execute before the recipe insert
      pool
        .query(insertRecipesQuery, insertRecipesData)
        .then(results => {
          response.json({info: results.rows})
        })
        .catch(e => console.error(e.stack))

      let ingredients = JSON.parse(request.query.ingredients)
      for(var i = 0; i < ingredients.length; i++){
        console.error(ingredients[i])
        const insertIngredientsRecipesQuery = "INSERT INTO IngredientsRecipes (IngredientID, RecipeID, Size) values (SELECT ID FROM Ingredients WHERE Name =  and Description = , SELECT ID FROM Recipes WHERE Name = $1 and Description = $2, $3)"
        const insertIngredientsRecipesData = [request.query.IngredientID, request.query.RecipeID, request.query.Size]
      }

      
     }
     

  })
  

  app.get('/recipes', function (request, response) {
    if(request.query.id){ // Give back the recipe with that ID including ingredients
      const getIngredientsQuery = `SELECT size,ingredientid 
                                   FROM ingredientsrecipes WHERE recipeid = $1`
      const getIngredientsData = [request.query.id]

      pool
        .query(getIngredientsQuery, getIngredientsData)
        .then(results => {
          response.json({info: results.rows})
        })
        .catch(e => console.error(e.stack))
        
     }else{ // Return all recipes with ids
      const getAllRecipesQuery = "SELECT id,name,description FROM recipes"
      pool
        .query(getAllRecipesQuery)
        .then(results => {
          response.json({info: results.rows})
        })
        .catch(e => console.error(e.stack))
     }

  })

}