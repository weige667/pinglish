/**
 * TTS 语音合成工具
 * 使用浏览器内置 Web Speech API
 */

export function speak(text, options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported')
    return
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = options.lang || 'en-US'
  utterance.rate = options.rate || 0.9
  utterance.pitch = options.pitch || 1
  utterance.volume = options.volume || 1

  // 慢速模式（用于听力训练慢速阶段）
  if (options.slow) {
    utterance.rate = 0.65
  }

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function speakWord(word) {
  speak(word, { rate: 0.85 })
}
