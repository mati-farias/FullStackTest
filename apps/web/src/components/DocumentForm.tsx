import type { UpdateDocumentDTO } from '@test/shared'

interface DocumentFormProps {
  initial?: { title: string; content: string }
  onSave: (dto: UpdateDocumentDTO) => Promise<void>
  onSubmit?: () => Promise<void>
  loading?: boolean
}

export function DocumentForm({
  initial,
  onSave,
  onSubmit,
  loading,
}: DocumentFormProps): JSX.Element {
  // TODO: Render a form with title (text input) and content (textarea) fields.
  //       Pre-populate fields with initial values when provided.
  //       Show a "Save draft" button that calls onSave({ title, content }).
  //       If onSubmit is provided, show a "Submit for review" button that calls onSubmit().
  //       Disable all buttons while loading is true.
  void initial; void onSave; void onSubmit; void loading
  throw new Error('Not implemented')
}
