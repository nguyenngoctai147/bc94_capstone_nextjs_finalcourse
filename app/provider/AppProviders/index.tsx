import type { ReactNode } from "react";
import BootstrapProviders from "@/provider/BootstrapProviders";
import ReduxProviders from "@/provider/ReduxProviders";

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProviders>
      <BootstrapProviders>{children}</BootstrapProviders>
    </ReduxProviders>
  );
}
