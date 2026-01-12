/**
 * Service to extract colors from an image using AI
 */
export class ColorExtractionService {
    /**
     * Extract both solid colors and gradients from an image in a single request
     * @param imageFile - The image file to analyze
     * @returns An object containing colors and gradients
     */
    async extractAll(imageFile: File): Promise<{ colors: string[], gradients: Array<{ start: string, end: string }> }> {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch(`/api/extract-colors`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to extract colors');
            }

            const data = await response.json();
            return {
                colors: data.colors || [],
                gradients: data.gradients || []
            };
        } catch (error: any) {
            console.error(`Error extracting all colors:`, error);
            throw error;
        }
    }

    /**
     * Extract the main solid colors from an image
     * @param imageFile - The image file to analyze
     * @returns An array of color hex codes
     */
    async extractColors(imageFile: File): Promise<string[]> {
        const result = await this.extractAll(imageFile);
        return result.colors;
    }

    /**
     * Extract gradient color pairs from an image
     * @param imageFile - The image file to analyze
     * @returns An array of gradient color pairs
     */
    async extractGradients(imageFile: File): Promise<Array<{ start: string, end: string }>> {
        const result = await this.extractAll(imageFile);
        return result.gradients;
    }
} 