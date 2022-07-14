<script lang="ts">
  import { currentTheme } from '../../stores/liquidStore'

  document.body.classList.add('ld-theme-ocean')

  let successMessages = [
    'Nice! 👍',
    'Aaaweeesome! 🙌',
    'Rock on! 🤘',
    'How cool is that?! 😎',
    'Rad! 🤓',
    'Supersonic! ⚡️',
    'Magic! ✨',
    'Groovy baby! 🕺',
    'Lovely! 🥰',
    'Smooth! 💆‍♀️',
    'Mind-blowing! 🤯️',
    'Excellent! 👌️',
    'Delicious! 🤤️',
    'Outa space! 👽',
  ]

  function onThemeChange(theme) {
    currentTheme.set(theme)
    document.body.classList.toggle('ld-theme-ocean', theme === 'ocean')
    document.body.classList.toggle('ld-theme-bubblegum', theme === 'bubblegum')
    document.body.classList.toggle('ld-theme-shake', theme === 'shake')
    document.body.classList.toggle('ld-theme-solvent', theme === 'solvent')
    document.body.classList.toggle('ld-theme-tea', theme === 'tea')

    setTimeout(() => {
      dispatchEvent(new CustomEvent('ldNotificationClear'))
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: successMessages[0],
            type: 'info',
            timeout: 2000,
          },
        })
      )
      successMessages = [...successMessages.slice(1), successMessages[0]]
    }, 500)
  }
</script>

<ld-typo class="mb-ld-24">Let's change the theme of the app first:</ld-typo>

<ld-label class="mb-ld-32 w-full">
  App Theme
  <ld-select
    on:ldchange={(ev) => {
      onThemeChange(ev.detail[0])
    }}
    placeholder="Pick a theme"
    prevent-deselection
  >
    <ld-option value="ocean" selected>Ocean</ld-option>
    <ld-option value="bubblegum">Bubblegum</ld-option>
    <ld-option value="shake">Shake</ld-option>
    <ld-option value="solvent">Solvent</ld-option>
    <ld-option value="tea">Tea</ld-option>
  </ld-select>
</ld-label>
