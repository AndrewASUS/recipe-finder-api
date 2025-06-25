import express from "express"
import { and, eq } from "drizzle-orm"

import { ENV } from "./config/env.js"
import {db} from "./config/db.js"
import { favoritesTable  } from "./db/schema.js"
import job from "./config/cron.js"


const app = express()
const PORT = ENV.PORT || 5001

if (ENV.NODE_ENV === "production") job.start()

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.status(200).json({ sucess: true })
})





// Create favorite Create favorite Create favorite Create favorite Create favorite
app.post("/api/favorites", async (req, res) => {
  console.log("Test")
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const newFavorite = await db.insert(favoritesTable).values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
    }).returning()

    res.status(201).json( newFavorite[0] )
  } catch (error) {
    console.log("Error adding a favorite", error)
    res.status(500).json({ error: "Internal server error" })
  }
})





// Read favorites Read favorites Read favorites Read favorites Read favorites 
app.get("/api/favorites/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const userFavorits = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, userId))

    res.status(200).json(userFavorits)

  } catch (error) {
    console.log("Error getting favorites", error)
    res.status(500).json({ error: "Internal server error" })
  }
})





// Delete favorite Delete favorite Delete favorite Delete favorite Delete favorite 
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params
    await db.delete(favoritesTable).where(
      and(eq(favoritesTable.userId, userId), eq(favoritesTable.recipeId, parseInt(recipeId)))
    )

    res.status(200).json({ message: "Favorite deleted successfully" })
  } catch (error) {
    console.log("Error deleting a favorite", error)
    res.status(500).json({ error: "Internal server errror" })
  }
})



app.listen(PORT, () => {
  console.log("Server is running on PORT:", + PORT)
})