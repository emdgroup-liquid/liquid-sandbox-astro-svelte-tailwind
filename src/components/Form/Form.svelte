<script lang="ts">
  import { form, field } from 'svelte-forms'
  import { required, email as emailValidator, url as urlValidator } from 'svelte-forms/validators'
  import { titles } from './titles'

  let validated = false

  const title = field('title', '', [])
  const fullName = field('fullName', '', [required()], { validateOnChange: false })
  const email = field('email', '', [required(), emailValidator()], { validateOnChange: false })
  const website = field('website', '', [urlValidator()], { validateOnChange: true })
  const termsAccepted = field(
    'termsAccepted',
    false,
    [required(), (value) => ({ valid: value === true, name: 'checked' })],
    { validateOnChange: false }
  )

  const sandboxForm = form(fullName, email, website, termsAccepted)

  function onCancel() {
    dispatchEvent(new CustomEvent('ldNotificationClear'))
    dispatchEvent(
      new CustomEvent('ldNotificationAdd', {
        detail: {
          content: "This button doesn't really do anything. 👻",
          type: 'warn',
        },
      })
    )
  }

  async function onSubmit() {
    await sandboxForm.validate()

    validated = true
    const isFormValid = $sandboxForm.valid

    if (isFormValid) {
      dispatchEvent(new CustomEvent('ldNotificationClear'))
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: `
							<div>
								<div>Thanks! We hope you like this sandbox. 🤗</div>
								<div>
									<a class='font-bold hover:underline' style="color: inherit" href='https://github.com/emdgroup-liquid/liquid/discussions' target='_blank'><b>Reach out</b></a>
									if you have any questions!
								</div>
							</div>`,
            type: 'info',
            timeout: 0,
          },
        })
      )
    } else {
      dispatchEvent(new CustomEvent('ldNotificationClear'))
      dispatchEvent(
        new CustomEvent('ldNotificationAdd', {
          detail: {
            content: 'The form is invalid! 😱',
            type: 'alert',
          },
        })
      )
    }
  }
</script>

<ld-typo class="mb-ld-24"> Next we have set up some form validation: </ld-typo>

<div class="grid grid-cols-1 md:grid-cols-2 gap-ld-24 mb-ld-32">
  <ld-label>
    <span class="flex justify-between">
      Your title (optional)
      <ld-tooltip arrow position="top right" class="h-1">
        <ld-typo> We are asking because we'd like to address you correctly. </ld-typo>
      </ld-tooltip>
    </span>
    <ld-select
      placeholder="No title"
      on:ldinput={(ev) => {
        title.set(ev.detail[0])
        // title = ev.detail[0]
      }}
    >
      {#each titles as title}
        <ld-option value={title}>
          {title}
        </ld-option>
      {/each}
    </ld-select>
    <ld-input-message mode="valid" style={`visibility: ${validated ? 'inherit' : 'hidden'}`}>
      Good pick.
    </ld-input-message>
  </ld-label>

  <ld-label>
    Your full name
    <ld-input
      placeholder="e.g. Jason Parse"
      tone="dark"
      value={$fullName.value}
      invalid={validated && $sandboxForm.hasError('fullName.required')}
      on:ldinput={(ev) => {
        fullName.set(ev.target.value)
        if (validated) fullName.validate()
      }}
      on:blur={() => {
        console.log($fullName.value)
      }}
    />

    <ld-input-message
      mode={!$sandboxForm.hasError('fullName.required') ? 'valid' : 'error'}
      style={`visibility: ${validated ? 'inherit' : 'hidden'}`}
    >
      {!$sandboxForm.hasError('fullName.required') ? 'Lovely name.' : 'Your full name is required.'}
    </ld-input-message>
  </ld-label>

  <ld-label>
    Your email address
    <ld-input
      type="email"
      placeholder="e.g. jason.parse@example.com"
      tone="dark"
      value={$email.value}
      invalid={validated &&
        ($sandboxForm.hasError('email.required') || $sandboxForm.hasError('email.not_an_email'))}
      on:ldinput={async (ev) => {
        email.set(ev.target.value)
        if (validated) {
          await email.validate()
          console.log($sandboxForm.hasError('email.not_an_email'))
        }
        // email = ev.target.value
        // if (emailDirty) validator.validate()
      }}
      on:blur={() => {
        // emailDirty = emailDirty || !!email
        // if (emailDirty) validator.validate()
      }}
    />
    <ld-input-message
      mode={$sandboxForm.hasError('email.required') || $sandboxForm.hasError('email.not_an_email')
        ? 'error'
        : 'valid'}
      style={`visibility: ${validated ? 'inherit' : 'hidden'}`}
    >
      {#if $sandboxForm.hasError('email.required')}
        Your email address is required.
      {:else if $sandboxForm.hasError('email.not_an_email')}
        That email address is invalid.
      {:else}
        Lovely email address.
      {/if}
    </ld-input-message>
  </ld-label>

  <ld-label>
    Your website (optional)
    <ld-input
      type="url"
      placeholder="e.g. https://example.com"
      tone="dark"
      value={$website.value}
      invalid={(validated && $sandboxForm.hasError('website.url')) || undefined}
      on:ldinput={(ev) => {
        website.set(ev.target.value)
        if (validated) website.validate()
      }}
      on:blur={() => {
        if (validated) website.validate()
        // websiteDirty = websiteDirty || !!website
        // if (websiteDirty) validator.validate()
      }}
    />
    <ld-input-message
      mode={$sandboxForm.hasError('website.url') ? 'error' : 'valid'}
      style={`visibility: ${validated ? 'inherit' : 'hidden'}`}
    >
      {!$sandboxForm.hasError('website.url')
        ? 'You even have a website! 👍'
        : 'This URL is invalid.'}
    </ld-input-message>
  </ld-label>
</div>

<ld-label class="w-full mb-ld-32">
  Comment (optional)
  <ld-input multiline placeholder="Be creative!" value="" tone="dark" style="min-height: 7rem" />
</ld-label>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-ld-24 items-center">
  <ld-label position="right" size="m">
    <span class:text-rr={validated && $sandboxForm.hasError('termsAccepted.required')}
      >I accept the terms (none).</span
    >
    <ld-checkbox
      tone="dark"
      checked={$termsAccepted.value}
      invalid={validated && $sandboxForm.hasError('termsAccepted.required')}
      on:ldinput={() => {
        termsAccepted.set(!$termsAccepted.value)
        if (validated) termsAccepted.validate()
      }}
      on:blur={() => {}}
    />
  </ld-label>

  <div class="grid grid-cols-2 gap-ld-16">
    <ld-button on:click={onCancel} mode="secondary"> Cancel </ld-button>
    <ld-button on:click={onSubmit}>Submit</ld-button>
  </div>
</div>
