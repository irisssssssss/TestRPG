import express from "express";
import { characterBuilds } from "./src/data/character-builds.js";

type CustomBuild = {
  name: string;
  strength: number;
  agility: number;
  wisdom: number;
  magic: number;
};

const app = express();
app.use(express.json());

// In-memory store — resets on server restart, intentional for the test casus
const customBuilds: Record<string, CustomBuild> = {};

const BUILT_IN_NAMES = new Set(Object.keys(characterBuilds));

app.get("/api/builds", (req, res) => {
  const buildParam = req.query.build;
  const buildName = Array.isArray(buildParam) ? buildParam[0] : buildParam;

  if (buildName) {
    const build =
      characterBuilds[buildName as keyof typeof characterBuilds] ??
      customBuilds[buildName as string];

    if (!build) {
      return res.status(404).json({ error: `Build '${buildName}' not found` });
    }

    return res.status(200).json({ [buildName as string]: build });
  }

  return res.status(200).json({ ...characterBuilds, ...customBuilds });
});

app.post("/api/builds", (req, res) => {
  const body = req.body as { build?: Partial<CustomBuild> } | undefined;

  if (!body?.build) {
    return res.status(400).json({ error: "Request body must contain a 'build' object" });
  }

  const { name, strength, agility, wisdom, magic } = body.build;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "'name' must be a non-empty string" });
  }

  const statFields: Array<[string, unknown]> = [
    ["strength", strength],
    ["agility", agility],
    ["wisdom", wisdom],
    ["magic", magic],
  ];

  for (const [key, val] of statFields) {
    if (typeof val !== "number" || !Number.isInteger(val)) {
      return res.status(400).json({ error: `'${key}' must be an integer` });
    }
    if (val < 0) {
      return res.status(400).json({ error: `'${key}' cannot be negative` });
    }
    if (val > 10) {
      return res.status(400).json({ error: `'${key}' cannot exceed 10` });
    }
  }

  const stats = [strength as number, agility as number, wisdom as number, magic as number];
  const sum = stats.reduce((a, b) => a + b, 0);
  if (sum > 10) {
    return res.status(400).json({ error: "The sum of all stats cannot exceed 10" });
  }

  const normalizedName = name.trim().toLowerCase();
  if (BUILT_IN_NAMES.has(normalizedName) || customBuilds[normalizedName]) {
    return res.status(409).json({ error: `Build name '${normalizedName}' already exists` });
  }

  const newBuild: CustomBuild = {
    name: normalizedName,
    strength: strength as number,
    agility: agility as number,
    wisdom: wisdom as number,
    magic: magic as number,
  };
  customBuilds[normalizedName] = newBuild;

  return res.status(201).json({ build: newBuild });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
