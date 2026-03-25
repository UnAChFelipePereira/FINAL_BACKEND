import { Injectable } from "@angular/core";

export interface PythonRunRequest {
  code: string;
  inputs?: string[];
}

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<any>;
  }
}

@Injectable({
  providedIn: "root",
})
export class PythonRuntimeService {
  private readonly pyodideScriptUrl = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
  private readonly pyodideIndexUrl = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
  private pyodideReadyPromise: Promise<any> | null = null;

  async run(request: PythonRunRequest | string): Promise<string> {
    const runRequest = typeof request === "string" ? { code: request, inputs: [] } : request;
    const pyodide = await this.loadPyodide();
    const stdoutBuffer: string[] = [];
    const stderrBuffer: string[] = [];
    const wrappedCode = this.wrapCodeWithInputs(runRequest.code || "", runRequest.inputs || []);

    pyodide.setStdout({
      batched: (message: string) => stdoutBuffer.push(message),
    });
    pyodide.setStderr({
      batched: (message: string) => stderrBuffer.push(message),
    });

    try {
      await pyodide.runPythonAsync(wrappedCode);
    } catch (error) {
      stderrBuffer.push(error instanceof Error ? error.message : String(error));
    }

    const output = [...stdoutBuffer, ...stderrBuffer].join("\n").trim();
    return output || "Programa ejecutado sin salida.";
  }

  extractInputPrompts(code: string): string[] {
    const prompts: string[] = [];
    const regex = /input\(([^)]*)\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(code)) !== null) {
      const rawPrompt = (match[1] || "").trim();
      const stringMatch = rawPrompt.match(/^(["'])(.*)\1$/s);
      prompts.push(stringMatch?.[2] || `Entrada ${prompts.length + 1}`);
    }

    return prompts;
  }

  private wrapCodeWithInputs(code: string, inputs: string[]): string {
    return [
      "import builtins",
      `__codex_inputs = iter(${JSON.stringify(inputs)})`,
      "def __codex_input(prompt=''):",
      "    try:",
      "        return str(next(__codex_inputs))",
      "    except StopIteration:",
      "        raise EOFError('No hay suficientes entradas para este programa.')",
      "builtins.input = __codex_input",
      code,
    ].join("\n");
  }

  private loadPyodide(): Promise<any> {
    if (!this.pyodideReadyPromise) {
      this.pyodideReadyPromise = this.ensureScriptLoaded().then(async () => {
        if (!window.loadPyodide) {
          throw new Error("No fue posible cargar el motor de Python.");
        }

        return window.loadPyodide({
          indexURL: this.pyodideIndexUrl,
        });
      });
    }

    return this.pyodideReadyPromise;
  }

  private ensureScriptLoaded(): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        `script[data-python-runtime="pyodide"]`
      ) as HTMLScriptElement | null;

      if (existingScript && window.loadPyodide) {
        resolve();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("No fue posible cargar Pyodide.")),
          { once: true }
        );
        return;
      }

      const script = document.createElement("script");
      script.src = this.pyodideScriptUrl;
      script.async = true;
      script.dataset["pythonRuntime"] = "pyodide";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("No fue posible cargar Pyodide."));
      document.body.appendChild(script);
    });
  }
}
