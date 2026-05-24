type Props = {
  name: string
  url: string
}

export function DeleteUserTemplate({ name, url }: Readonly<Props>) {
  return (
    <div>
      <h1>Delete Your Account</h1>
      <p>Hi {name},</p>
      <p>Click the link below to delete your account:</p>
      <p>
        <a href={url}>{url}</a>
      </p>
      <p>
        Remember that this action cannot be undone, and all of your data will be permanently
        deleted.
      </p>
    </div>
  )
}
