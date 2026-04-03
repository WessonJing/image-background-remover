export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const file = formData.get('image');

    if (!file) {
      return Response.json({ success: false, error: 'No image file provided.' }, { status: 400 });
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { success: false, error: 'Unsupported format. Please use JPG, PNG, or WEBP.' },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { success: false, error: 'File too large. Please upload an image under 10MB.' },
        { status: 400 }
      );
    }

    const apiKey = context.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: 'API key not configured.' },
        { status: 500 }
      );
    }

    const removeBgForm = new FormData();
    removeBgForm.append('image_file', file);
    removeBgForm.append('size', 'auto');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    let response;
    try {
      response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: removeBgForm,
        signal: controller.signal,
      });
    } catch (err) {
      if (err.name === 'AbortError') {
        return Response.json(
          { success: false, error: 'Processing timeout. Please try again.' },
          { status: 504 }
        );
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const status = response.status;
      if (status === 402 || status === 429) {
        return Response.json(
          { success: false, error: 'Service busy, please try again later.' },
          { status: 429 }
        );
      }
      if (status === 400) {
        return Response.json(
          { success: false, error: 'Unsupported format. Please use JPG, PNG, or WEBP.' },
          { status: 400 }
        );
      }
      return Response.json(
        { success: false, error: 'Failed to process image. Please try again.' },
        { status: 500 }
      );
    }

    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    return Response.json({ success: true, image: base64 });
  } catch (error) {
    console.error('remove-bg API error:', error);
    return Response.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
