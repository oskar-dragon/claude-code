---
name: create-recipe
description: Create a recipe note from URL or text with automatic formatting, unit conversion, and macro calculation
argument-hint: <url-or-recipe-text>
allowed-tools:
  - Read
  - Skill
  - AskUserQuestion
---

# Recipe Creation Command

You are creating a recipe note in Oskar's Obsidian vault. Follow this workflow precisely, delegating to the appropriate skills at each step.

## Input

The user has provided: `{{args}}`

## Workflow

### 1. Determine Input Type

Examine the input to determine if it's:
- **URL**: Starts with http://, https://, or looks like a web address
- **Recipe Text**: Everything else (raw recipe data, ingredients, instructions)

### 2. Extract Recipe Content

**If URL provided:**
1. Use the `obsidian:defuddle` skill to extract clean content from the webpage
2. The defuddle skill will remove navigation, ads, and clutter

**If recipe text provided:**
1. Use the text directly as recipe content

### 3. Parse Recipe Data

Extract the following from the content:

**Required fields:**
- Recipe title/name
- Ingredients list
- Instructions/directions

**Optional fields:**
- Author name
- Source URL
- Servings count
- Prep/cook time
- Image URL
- Existing macros (calories, protein, carbs, fat)

### 4. Convert Units to European Standard

**Unit Conversion Reference:**

All measurements must be in kg/g/ml/l. Round to sensible increments (5g, 10ml).

**Common conversions:**
- 1 cup = 240ml
- 1/2 cup = 120ml
- 1/4 cup = 60ml
- 1 tablespoon (tbsp) = 15ml
- 1 teaspoon (tsp) = 5ml
- 1 fluid ounce (fl oz) = 30ml
- 1 pound (lb) = 454g
- 1 ounce (oz) = 28g

**Examples:**
- "2 cups flour" → "480ml flour"
- "1 lb chicken" → "450g chicken"
- "3 tbsp olive oil" → "45ml olive oil"
- "8 oz pasta" → "225g pasta"

Apply conversions throughout the ingredients list.

### 5. Calculate Macros (Per Serving)

**If macros are provided in the recipe:**
- Use them directly
- Ensure they're per serving
- Convert to European format if needed

**If macros are NOT provided:**
Use this simple lookup table for basic estimation:

**Proteins (per 100g):**
- Chicken breast: 165 cal, 31g protein, 0g carbs, 3.6g fat
- Ground beef: 250 cal, 26g protein, 0g carbs, 15g fat
- Eggs (per egg ~50g): 70 cal, 6g protein, 1g carbs, 5g fat
- Salmon: 200 cal, 20g protein, 0g carbs, 13g fat

**Carbs (per 100g):**
- Rice (cooked): 130 cal, 2.7g protein, 28g carbs, 0.3g fat
- Pasta (cooked): 130 cal, 5g protein, 25g carbs, 1g fat
- Bread: 265 cal, 9g protein, 49g carbs, 3.2g fat
- Potatoes: 77 cal, 2g protein, 17g carbs, 0.1g fat

**Fats (per 100ml/100g):**
- Olive oil: 884 cal, 0g protein, 0g carbs, 100g fat
- Butter: 717 cal, 0.9g protein, 0.1g carbs, 81g fat

**Vegetables (per 100g):** ~25-50 cal, minimal macros
**Fruits (per 100g):** ~50-70 cal, ~15g carbs

**Calculation process:**
1. Estimate total calories and macros for all ingredients
2. Divide by servings count
3. Round to whole numbers
4. Add note: "Based on estimated ingredient values"

**Macro format:**
```markdown
## Nutrition (Per Serving)

- Calories: XXX kcal
- Protein: XXg
- Carbs: XXg
- Fat: XXg

*Based on estimated ingredient values*
```

### 6. Determine Cuisine and Type

**Cuisine Taxonomy:**
- Japanese
- Mexican
- Turkish
- Polish
- Thai
- Greek
- Middle Eastern
- Mediterranean
- Indian
- American
- Italian
- British
- French
- Chinese
- Korean
- Vietnamese
- Spanish
- Moroccan
- Lebanese
- Portuguese
- German
- Caribbean
- Cajun

**Type Taxonomy:**
- [[Breakfasts]]
- [[Dinners]]
- [[Desserts]]
- [[Salads]]

**Matching process:**
1. Analyze recipe name, ingredients, and cooking methods
2. Match to most appropriate cuisine and type
3. **ONLY use AskUserQuestion if:**
   - Cuisine is completely unclear (not even close match)
   - Type cannot be determined at all
4. Do NOT prompt if there's a reasonable match (even if not 100% certain)

### 7. Extract Image URL

**Priority order:**
1. Look for Open Graph image in webpage metadata (if URL source)
2. Look for first large image in content
3. Look for image URL in recipe text
4. If none found, leave image field empty

Ensure image URL is complete (starts with http:// or https://)

### 8. Structure the Note with obsidian-markdown Skill

Use the `obsidian:obsidian-markdown` skill to structure the note following this template:

**Template structure** (see `templates/recipe-template.md`):

```markdown
---
categories:
  - "[[Recipes]]"
cuisine: <cuisine>
type:
  - "<type-wikilink>"
author: [<author-if-available>]
url: <source-url>
rating:
created: <current-date>
last: <current-date>
image: <image-url-or-empty>
this_week:
---
## Ingredients

- <ingredient-1-with-european-units>
- <ingredient-2-with-european-units>
...

## Directions

- <step-1>
- <step-2>
...

## Notes

-

## Nutrition (Per Serving)

- Calories: XXX kcal
- Protein: XXg
- Carbs: XXg
- Fat: XXg

*Based on estimated ingredient values*
```

**Critical rules:**
- Use wikilink format for type: `- "[[Dinners]]"` not just `Dinners`
- Include all frontmatter fields even if empty
- Ensure created/last dates use YYYY-MM-DD format
- Convert all units before adding to ingredients
- Add nutrition section even if estimated

### 9. Create the Note with obsidian-cli Skill

Use the `obsidian:obsidian-cli` skill to create the note:

**Note location (CONFIGURED FOR OSKAR'S VAULT):** `/Users/oskardragon-work/Library/CloudStorage/GoogleDrive-dragon.t.oskar@gmail.com/My Drive/Obsidian/Vault V2/Notes/`

**Note filename:** `<Recipe Title>.md`

**Example:** `Chicken Shawarma Meal Prep.md`

**Note**: If using with a different vault, update this path to match your vault's Notes folder location.

### 10. Confirm Creation

After the note is created, respond with:

```
Created recipe at Notes/<Recipe Title>.md
```

Make the path clickable using the full absolute path.

## Important Notes

- **Delegate to skills**: Use Skill tool to invoke obsidian:defuddle, obsidian:obsidian-markdown, and obsidian:obsidian-cli
- **Don't hardcode**: All templates, conversions, and taxonomies should be referenced, not memorized
- **Minimal prompts**: Only use AskUserQuestion as absolute last resort
- **Fully automated**: Process everything in one go unless truly blocked
- **European units**: All measurements must be metric (g/kg/ml/l)
- **Per serving**: All macros must be calculated per serving, not total

## Error Handling

**If defuddle fails:**
- Inform user the URL couldn't be processed
- Ask if they want to provide the recipe text manually

**If recipe data is incomplete:**
- Create note with available data
- Leave missing sections empty or with placeholders

**If cuisine/type matching fails completely:**
- Use AskUserQuestion to present options
- Provide 2-3 most likely options based on analysis
