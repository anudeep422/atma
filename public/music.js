// Meditation sounds, generated live with the Web Audio API: no music files, no licences.
// Tanpura drone, Om drone, singing bowls, rain, ocean waves, and a soft bell.

const AtmaSound = (() => {
  let ctx = null;
  let master = null;
  let current = null; // { stop() }

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.8;
      // Soft "temple hall" reverb makes every sound smoother and warmer.
      const dry = ctx.createGain();
      dry.gain.value = 0.75;
      const wet = ctx.createGain();
      wet.gain.value = 0.45;
      const verb = ctx.createConvolver();
      verb.buffer = hallImpulse(4.5);
      master.connect(dry).connect(ctx.destination);
      master.connect(verb).connect(wet).connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Stereo impulse response: decaying noise, a cheap but natural-sounding reverb.
  function hallImpulse(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    return buf;
  }

  // A struck metal bowl: a few inharmonic partials with long decays.
  function bowl(freq, level = 0.25, when = 0, decay = 7) {
    const t0 = ensure().currentTime + when;
    [[1, 1], [2.76, 0.45], [5.4, 0.2], [8.93, 0.08]].forEach(([ratio, amp]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * ratio;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(level * amp, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay / ratio ** 0.5);
      o.connect(g).connect(master);
      o.start(t0);
      o.stop(t0 + decay + 0.1);
    });
  }

  function noiseBuffer(brown = false) {
    const len = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * white) / 1.02; d[i] = last * 3.5; } else d[i] = white;
    }
    return buf;
  }

  function fadeIn(node, target, secs = 5) {
    node.gain.setValueAtTime(0, ctx.currentTime);
    node.gain.linearRampToValueAtTime(target, ctx.currentTime + secs);
  }

  function fadeOutAndStop(node, nodes, secs = 3.5) {
    const t = ctx.currentTime;
    node.gain.cancelScheduledValues(t);
    node.gain.setValueAtTime(node.gain.value, t);
    node.gain.linearRampToValueAtTime(0, t + secs);
    setTimeout(() => nodes.forEach((n) => { try { n.stop?.(); n.disconnect(); } catch {} }), secs * 1000 + 100);
  }

  // ---- Soundscapes ----
  const scapes = {
    // Four strings plucked in turn: Pa (low), Sa, Sa, Sa (low): the classic tanpura cycle on C.
    tanpura() {
      const out = ctx.createGain();
      fadeIn(out, 0.42, 6);
      out.connect(master);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      filter.Q.value = 0.3;
      filter.connect(out);
      const nodes = [filter];
      // A quiet continuous Sa + Pa drone underneath, so there are no gaps between plucks.
      [[130.81, 0.05], [196.0, 0.025], [65.41, 0.04]].forEach(([f, a]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        g.gain.value = a;
        o.connect(g).connect(filter);
        o.start();
        nodes.push(o);
      });
      // Four strings plucked slowly in turn: Pa, Sa, Sa, low Sa, with soft attacks and long overlapping rings.
      const strings = [98.0, 130.81, 130.81, 65.41];
      let i = 0;
      const pluck = () => {
        const f = strings[i++ % 4];
        const t0 = ctx.currentTime;
        [[1, 0.07], [2, 0.035], [3, 0.02], [4, 0.01]].forEach(([h, amp]) => {
          [0, 0.4].forEach((detune) => { // two slightly detuned voices: the gentle tanpura shimmer
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.value = f * h + detune;
            g.gain.setValueAtTime(0, t0);
            g.gain.linearRampToValueAtTime(amp, t0 + 0.25);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 7.5);
            o.connect(g).connect(filter);
            o.start(t0);
            o.stop(t0 + 7.6);
          });
        });
      };
      pluck();
      const timer = setInterval(pluck, 2100);
      return { stop() { clearInterval(timer); fadeOutAndStop(out, nodes, 4); } };
    },

    // A deep, soft Om-like hum with a slow breathing swell.
    om() {
      const out = ctx.createGain();
      fadeIn(out, 0.35, 4);
      out.connect(master);
      const nodes = [];
      [[136.1, 0.5], [272.2, 0.18], [204.15, 0.12], [68.05, 0.3]].forEach(([f, a]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.value = a;
        o.connect(g).connect(out);
        o.start();
        nodes.push(o);
      });
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1; // one swell every ~10 seconds
      lfoGain.gain.value = 0.12;
      lfo.connect(lfoGain).connect(out.gain);
      lfo.start();
      nodes.push(lfo);
      return { stop() { fadeOutAndStop(out, nodes); } };
    },

    // Gentle bowl strikes at random intervals.
    bowls() {
      const notes = [196.0, 261.63, 293.66, 329.63, 392.0];
      let timer;
      const strike = () => {
        bowl(notes[Math.floor(Math.random() * notes.length)], 0.08, 0, 11);
        timer = setTimeout(strike, 6000 + Math.random() * 7000);
      };
      strike();
      return { stop() { clearTimeout(timer); } };
    },

    rain() {
      const out = ctx.createGain();
      fadeIn(out, 0.22);
      out.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(false);
      src.loop = true;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 500;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 5500;
      src.connect(hp).connect(lp).connect(out);
      src.start();
      return { stop() { fadeOutAndStop(out, [src]); } };
    },

    // Brown noise with slow swells, like waves arriving every ~11 seconds.
    ocean() {
      const out = ctx.createGain();
      fadeIn(out, 0.25);
      out.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(true);
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      const swell = ctx.createGain();
      swell.gain.value = 0.6;
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.09;
      lfoGain.gain.value = 0.45;
      lfo.connect(lfoGain).connect(swell.gain);
      src.connect(lp).connect(swell).connect(out);
      src.start();
      lfo.start();
      return { stop() { fadeOutAndStop(out, [src, lfo]); } };
    },
  };

  return {
    names: ["tanpura", "om", "bowls", "rain", "ocean", "none"],
    /** Starts a soundscape (or silence with "none"). */
    play(name) {
      ensure();
      this.stop();
      if (scapes[name]) current = scapes[name]();
    },
    stop() {
      if (current) { current.stop(); current = null; }
    },
    /** A soft bell: start, step change and end of a session. */
    bell(level = 0.2) { bowl(392.0, level, 0, 8); },
    /** Lowers the music while the voice speaks, then brings it back smoothly. */
    duck(on) {
      if (!ctx) return;
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(on ? 0.3 : 0.8, t + (on ? 0.6 : 2.5));
    },
    pause() { ctx?.suspend(); },
    resume() { ctx?.resume(); },
  };
})();
