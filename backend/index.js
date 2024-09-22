import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3020;

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;
  console.log(req.body);
  const user_id = data.user_id;
  const email = data.email;
  const roll_number = data.roll_number;

  // Separate numbers and alphabets
  const numbers = data.filter((item) => !isNaN(item));
  const alphabets = data.filter((item) => isNaN(item));

  // Find the highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(
    (char) => char === char.toLowerCase() && isNaN(char)
  );
  const highestLowercaseAlphabet = lowercaseAlphabets.length
    ? [lowercaseAlphabets.sort().reverse()[0]]
    : [];

  // File validation
  let file_valid = false;
  let file_mime_type = "";
  let file_size_kb = 0;

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      file_valid = true;
      file_mime_type = "image/png";
      file_size_kb = (buffer.length / 1024).toFixed(2);
    } catch (error) {
      file_valid = false;
    }
  }

  res.json({
    is_success: true,
    user_id,
    email,
    roll_number,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid,
    file_mime_type,
    file_size_kb,
  });
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
