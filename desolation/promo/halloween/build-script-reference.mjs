// Halloween-campaign shorts for TerrorWell, Campfiya, and Desolation — same proven pattern
// as Align's promo shorts (real art/screenshots + Ken Burns + textfile captions + music),
// adapted per app. textfile= (not inline text=) sidesteps all the drawtext escaping grief.
import { execFileSync } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "output");
const TMP = join(ROOT, ".tmp");
const FONT = "C:/Windows/Fonts/segoeuib.ttf";
const SEG_SECONDS = 5;
const FPS = 30;
const W = 1080, H = 1920;
const DOWNLOADS = "C:\\Users\\mxz\\Downloads";
const D = (name) => join(DOWNLOADS, name);

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
}
const ffPath = (p) => p.replace(/\\/g, "/").replace(/:/g, "\\:");

async function renderSegment(imgPath, captionLinePaths, outPath) {
  const frames = SEG_SECONDS * FPS;
  // One drawtext per caption line, each its own textfile, stacked with a y offset — a
  // literal newline BYTE inside a single textfile's content renders a stray tofu glyph for
  // the byte itself (same issue as an inline `text=` newline; drawtext's own line-break
  // handling doesn't fully absorb it either way), so multi-line captions are pre-split into
  // separate one-line files instead of relying on any embedded line break.
  const lineHeight = 66;
  const startY = `h-460-${Math.floor(((captionLinePaths.length - 1) * lineHeight) / 2)}`;
  const drawtexts = captionLinePaths
    .map((p, i) => `drawtext=textfile='${ffPath(p)}':fontfile='${ffPath(FONT)}':fontcolor=white:fontsize=56:box=1:boxcolor=black@0.55:boxborderw=24:x=(w-text_w)/2:y=(${startY})+${i * lineHeight}`)
    .join(",");
  const vf = [
    `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`,
    `zoompan=z='min(zoom+0.0007,1.13)':d=${frames}:s=${W}x${H}:fps=${FPS}`,
    `fade=t=in:st=0:d=0.3`,
    `fade=t=out:st=${SEG_SECONDS - 0.3}:d=0.3`,
    drawtexts,
  ].join(",");
  ffmpeg(["-loop", "1", "-i", imgPath, "-t", String(SEG_SECONDS), "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", String(FPS), outPath]);
}

/** CTA end card — logo (if given) + headline + URL over a dark background image. */
async function renderCTA(bgImg, logoImg, headline, url, outPath) {
  const parts = [`[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},eq=brightness=-0.25[bg]`];
  const inputs = ["-loop", "1", "-i", bgImg];
  let last = "[bg]";
  if (logoImg) {
    inputs.push("-i", logoImg);
    parts.push(`[1:v]scale=520:-1[logo]`, `${last}[logo]overlay=(W-w)/2:420[withlogo]`);
    last = "[withlogo]";
  }
  const headlineY = logoImg ? 1150 : 820;
  parts.push(
    `${last}drawtext=fontfile='${ffPath(FONT)}':text='${headline.replace(/'/g, "\u2019")}':fontsize=52:fontcolor=0xff8c1a:borderw=5:bordercolor=black:x=(w-text_w)/2:y=${headlineY}[withhead]`,
    `[withhead]drawtext=fontfile='${ffPath(FONT)}':text='${url}':fontsize=44:fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=${headlineY + 100}[out]`,
  );
  ffmpeg([...inputs, "-t", String(SEG_SECONDS), "-filter_complex", parts.join(";"), "-map", "[out]", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", String(FPS), outPath]);
}

async function buildShort({ name, shots, cta, music, musicGainDb = -12 }) {
  const shortTmp = join(TMP, name);
  await mkdir(shortTmp, { recursive: true });
  const segPaths = [];
  for (let i = 0; i < shots.length; i++) {
    const { img, caption } = shots[i];
    if (!existsSync(img)) throw new Error(`missing image: ${img}`);
    const lines = caption.split("\n");
    const linePaths = [];
    for (let j = 0; j < lines.length; j++) {
      const p = join(shortTmp, `cap-${i}-${j}.txt`);
      await writeFile(p, lines[j], "utf-8");
      linePaths.push(p);
    }
    const segPath = join(shortTmp, `seg-${i}.mp4`);
    await renderSegment(img, linePaths, segPath);
    segPaths.push(segPath);
  }
  const ctaPath = join(shortTmp, "cta.mp4");
  await renderCTA(cta.bgImg, cta.logoImg, cta.headline, cta.url, ctaPath);
  segPaths.push(ctaPath);

  const concatListPath = join(shortTmp, "concat.txt");
  await writeFile(concatListPath, segPaths.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n"), "utf-8");
  const silentPath = join(shortTmp, "silent.mp4");
  ffmpeg(["-f", "concat", "-safe", "0", "-i", concatListPath, "-c", "copy", silentPath]);

  const totalSeconds = shots.length * SEG_SECONDS + SEG_SECONDS;
  await mkdir(OUT, { recursive: true });
  const finalPath = join(OUT, `${name}.mp4`);
  ffmpeg([
    // -stream_loop -1 on the music input matters here — several of these tracks (unlike
    // Align's, which ran long enough already) are well under the short's own length (one is
    // only ~8s against a 30s video), and without looping, atrim just silently hands back
    // whatever's actually there. That fed a real bug: -shortest then truncated against the
    // short real audio length, but because video was `-c:v copy`, the frame count it landed
    // on didn't even match the audio's own true length — a genuinely broken file (audio
    // stops partway, container duration metadata disagreeing with both). Looping first
    // means atrim always has 30s of real audio content to cut down to, however short the
    // source loop unit is.
    "-stream_loop", "-1", "-i", music,
    "-i", silentPath,
    "-filter_complex",
    `[0:a]atrim=0:${totalSeconds},afade=t=in:st=0:d=0.5,afade=t=out:st=${totalSeconds - 1.5}:d=1.5,volume=${musicGainDb}dB[aout]`,
    "-map", "1:v", "-map", "[aout]", "-c:v", "copy", "-c:a", "aac", "-shortest", finalPath,
  ]);
  console.log(`${name}: ${totalSeconds}s -> ${finalPath}`);
}

const TW = "C:\\Users\\mxz\\Desktop\\projects\\TerrorWell\\assets";
const CF = "C:\\Users\\mxz\\Desktop\\projects\\campfiya\\pictures";
const DS = "C:\\Users\\mxz\\Desktop\\projects\\games\\desolation\\visuals";

const SHORTS = [
  {
    name: "terrorwell-halloween",
    music: D("leberch-suspenseful-510098.mp3"),
    musicGainDb: -10,
    shots: [
      { img: join(TW, "intro", "well_lightning.png"), caption: "IT'S ALMOST HALLOWEEN." },
      { img: join(TW, "spooky", "spooky1.jpg"), caption: "TerrorWell writes YOUR nightmare." },
      { img: join(TW, "spooky", "spooky10.jpg"), caption: "Choose your path.\nLive with what you chose." },
      { img: join(TW, "backgrounds", "well_wall_1.jpg"), caption: "New horror.\nEvery single time you play." },
      { img: join(TW, "spooky", "spooky19.jpg"), caption: "Some stories don't let you leave." },
    ],
    cta: {
      bgImg: join(TW, "intro", "well.png"),
      logoImg: join(TW, "icon.png"),
      headline: "PLAY THE HALLOWEEN SPECIAL",
      url: "terrorwell.rastacamp.com",
    },
  },
  {
    name: "campfiya-halloween",
    music: D("sonican-mystery-trap-516619.mp3"),
    musicGainDb: -8,
    shots: [
      { img: join(CF, "night campfire.jpg"), caption: "GATHER ROUND." },
      { img: join(CF, "1.png"), caption: "Halloween season means new horror." },
      { img: join(CF, "13.png"), caption: "Real anthologies. Real dread." },
      { img: join(CF, "26.png"), caption: "Some stories find you." },
      { img: join(CF, "spooky24.jpg"), caption: "Multimedia.\nNot just words." },
    ],
    cta: {
      bgImg: join(CF, "lone campfire.jpg"),
      logoImg: join(CF, "campfiya title.png"),
      headline: "READ THE HALLOWEEN ANTHOLOGY",
      url: "campfiya.rastacamp.com",
    },
  },
  {
    name: "desolation-halloween",
    music: "C:\\Users\\mxz\\Desktop\\projects\\games\\desolation\\title.mp3",
    musicGainDb: -14,
    shots: [
      { img: join(DS, "clearing_lab_nightime.png"), caption: "SOMETHING SURVIVED THE FALL." },
      { img: join(DS, "breakdown.png"), caption: "The night isn't empty." },
      { img: join(DS, "command_room.png"), caption: "Something happened here." },
      { img: join(DS, "farm_and_rabbits.png"), caption: "Build. Defend.\nSurvive till dawn." },
      { img: join(DS, "breakdown.png"), caption: "Tears of the Moon.\nThis Halloween." },
    ],
    cta: {
      bgImg: join(DS, "command_room.png"),
      logoImg: null,
      headline: "SURVIVE THE HALLOWEEN UPDATE",
      url: "desolation.rastacamp.com",
    },
  },
];

const only = process.argv.slice(2);
const targets = only.length ? SHORTS.filter((s) => only.includes(s.name)) : SHORTS;
for (const s of targets) await buildShort(s);
await rm(TMP, { recursive: true, force: true });
console.log("all halloween shorts built");
