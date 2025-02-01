type GeneralIcon = {
  variant?: "default" | "white" | "active";
} & React.SVGProps<SVGSVGElement>;

type GeneralAPIResponse = {
  message?: string | null;
  code?: number | null;
  status?: boolean | null;
  success?: boolean | null;
  error?: string | null;
  data?: any;
};
