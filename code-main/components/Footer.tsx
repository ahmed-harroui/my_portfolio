"use client";

export default function Footer() {
    return (
        <footer className="py-16 border-t border-border/50 max-w-5xl mx-auto px-8 sm:px-12 lg:px-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">© 2025 Ahmed Harroui</div>
                    <div className="text-xs text-muted-foreground/60">Designed and built with v0</div>
                </div>
            </div>
        </footer>
    );
}
