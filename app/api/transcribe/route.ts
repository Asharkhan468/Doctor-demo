export const maxDuration = 120;

const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_AUDIO_BYTES + 128 * 1024;
const supportedFormats: Record<string, string> = {
  mp3: 'audio/mpeg',
  mp4: 'audio/mp4',
  mpeg: 'audio/mpeg',
  mpga: 'audio/mpeg',
  m4a: 'audio/mp4',
  wav: 'audio/wav',
  webm: 'audio/webm',
};

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: { message } }, { status });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return errorResponse('Requests must come from this application.', 403);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return errorResponse('Speech transcription is not configured. Add OPENAI_API_KEY on the server.', 503);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return errorResponse('Audio files must be 4 MB or smaller.', 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('A valid audio upload is required.', 400);
  }

  const audio = formData.get('audio');
  if (!(audio instanceof File) || audio.size === 0) {
    return errorResponse('Choose a non-empty audio file to transcribe.', 400);
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return errorResponse('Audio files must be 4 MB or smaller.', 413);
  }

  const extension = audio.name.split('.').pop()?.toLowerCase() || '';
  const contentType = supportedFormats[extension];
  if (!contentType) {
    return errorResponse('Use an MP3, MP4, MPEG, MPGA, M4A, WAV, or WebM audio file.', 415);
  }

  const upstream = new FormData();
  upstream.set('model', process.env.OPENAI_TRANSCRIPTION_MODEL || 'gpt-transcribe');
  upstream.set('response_format', 'json');
  upstream.set('file', new File([audio], `consultation.${extension}`, { type: contentType }));

  let providerResponse: Response;
  try {
    providerResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
      signal: AbortSignal.timeout(120_000),
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      return errorResponse('Transcription timed out. Try a shorter recording.', 504);
    }
    return errorResponse('Could not reach the transcription provider. Please try again.', 502);
  }

  if (!providerResponse.ok) {
    const status = providerResponse.status === 401 || providerResponse.status === 403 ? 503 : 502;
    const message =
      providerResponse.status === 429
        ? 'The transcription provider is busy or its quota is exhausted. Try again later.'
        : status === 503
          ? 'The transcription provider rejected its server credentials.'
          : 'The transcription provider could not process this audio file.';
    return errorResponse(message, status);
  }

  let result: unknown;
  try {
    result = await providerResponse.json();
  } catch {
    return errorResponse('The transcription provider returned an invalid response.', 502);
  }

  if (
    typeof result !== 'object' ||
    result === null ||
    !('text' in result) ||
    typeof result.text !== 'string' ||
    !result.text.trim()
  ) {
    return errorResponse('The transcription provider returned no transcript.', 502);
  }

  return Response.json({ transcript: result.text.trim() });
}
