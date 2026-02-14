using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

class Launcher
{
    [STAThread]
    static void Main()
    {
        string exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        string rootDir = Path.GetDirectoryName(exeDir);

        // Read electron binary path from node_modules
        string electronPath = FindElectronExe(rootDir);
        if (electronPath == null || !File.Exists(electronPath))
        {
            ShowError("找不到 Electron 运行时，请先运行 pnpm install");
            return;
        }

        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = electronPath;
            psi.Arguments = "\"" + exeDir + "\"";
            psi.WorkingDirectory = rootDir;
            psi.UseShellExecute = false;

            // Clear ELECTRON_RUN_AS_NODE so Electron runs as GUI
            if (psi.EnvironmentVariables.ContainsKey("ELECTRON_RUN_AS_NODE"))
            {
                psi.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE");
            }

            Process.Start(psi);
        }
        catch (Exception ex)
        {
            ShowError("启动失败: " + ex.Message);
        }
    }

    static string FindElectronExe(string rootDir)
    {
        // Try reading from node_modules/electron/path.txt
        string[] candidates = new string[]
        {
            Path.Combine(rootDir, "node_modules", "electron", "dist", "electron.exe"),
            Path.Combine(rootDir, "node_modules", ".pnpm", "electron@40.1.0", "node_modules", "electron", "dist", "electron.exe"),
        };

        // Also try reading path.txt for the actual binary name
        string pathTxt = Path.Combine(rootDir, "node_modules", "electron", "path.txt");
        if (!File.Exists(pathTxt))
        {
            // pnpm layout
            pathTxt = Path.Combine(rootDir, "node_modules", ".pnpm", "electron@40.1.0", "node_modules", "electron", "path.txt");
        }
        if (File.Exists(pathTxt))
        {
            string binName = File.ReadAllText(pathTxt).Trim();
            string binDir = Path.GetDirectoryName(pathTxt);
            string fullPath = Path.Combine(binDir, "dist", binName);
            if (File.Exists(fullPath)) return fullPath;
        }

        foreach (string p in candidates)
        {
            if (File.Exists(p)) return p;
        }

        // Search pnpm store for any electron version
        string pnpmDir = Path.Combine(rootDir, "node_modules", ".pnpm");
        if (Directory.Exists(pnpmDir))
        {
            foreach (string dir in Directory.GetDirectories(pnpmDir, "electron@*"))
            {
                string exe = Path.Combine(dir, "node_modules", "electron", "dist", "electron.exe");
                if (File.Exists(exe)) return exe;
            }
        }

        return null;
    }

    static void ShowError(string message)
    {
        // Use a simple console fallback since we don't reference System.Windows.Forms
        try
        {
            ProcessStartInfo psi = new ProcessStartInfo();
            psi.FileName = "mshta.exe";
            psi.Arguments = "\"javascript:var sh=new ActiveXObject('WScript.Shell');sh.Popup('" +
                message.Replace("'", "\\'") + "',0,'智税宝',16);close()\"";
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;
            Process p = Process.Start(psi);
            p.WaitForExit();
        }
        catch { }
    }
}
