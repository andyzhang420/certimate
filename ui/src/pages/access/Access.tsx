import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Key } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AccessEditDialog from "@/components/certimate/AccessEditDialog";
import XPagination from "@/components/certimate/XPagination";
import { convertZulu2Beijing } from "@/lib/time";
import { Access as AccessType, accessProvidersMap } from "@/domain/access";
import { remove } from "@/repository/access";
import { useConfigContext } from "@/providers/config";

const Access = () => {
  const { t } = useTranslation();
  const { config, deleteAccess } = useConfigContext();
  const { accesses } = config;

  const perPage = 10;

  const totalPages = Math.ceil(accesses.length / perPage);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = query.get("page");
  const pageNumber = page ? Number(page) : 1;

  const startIndex = (pageNumber - 1) * perPage;
  const endIndex = startIndex + perPage;

  const handleDelete = async (data: AccessType) => {
    const rs = await remove(data);
    deleteAccess(rs.id);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground">{t("access.page.title")}</div>
        <AccessEditDialog trigger={<Button>{t("access.authorization.add")}</Button>} op="add" />
      </div>

      {accesses.length === 0 ? (
        <div className="flex flex-col items-center mt-10">
          <span className="bg-orange-100 p-5 rounded-full">
            <Key size={40} className="text-primary" />
          </span>

          <div className="text-center text-sm text-muted-foreground mt-3">{t("access.authorization.nodata")}</div>
          <AccessEditDialog trigger={<Button>{t("access.authorization.add")}</Button>} op="add" className="mt-3" />
        </div>
      ) : (
        <>
          <div className="hidden sm:flex sm:flex-row text-muted-foreground text-sm border-b dark:border-stone-500 sm:p-2 mt-5">
            <div className="w-48">{t("common.text.name")}</div>
            <div className="w-48">{t("common.text.provider")}</div>

            <div className="w-60">{t("common.text.created_at")}</div>
            <div className="w-60">{t("common.text.updated_at")}</div>
            <div className="grow">{t("common.text.operations")}</div>
          </div>
          {accesses.slice(startIndex, endIndex).map((access) => (
            <div
              className="flex flex-col sm:flex-row text-secondary-foreground border-b dark:border-stone-500 sm:p-2 hover:bg-muted/50 text-sm"
              key={access.id}
            >
              <div className="sm:w-48 w-full pt-1 sm:pt-0 flex items-start">
                <div className="pr-3  truncate">{access.name}</div>
              </div>
              <div className="sm:w-48 w-full pt-1 sm:pt-0 flex  items-center space-x-2">
                <img src={accessProvidersMap.get(access.configType)?.icon} className="w-6" />
                <div>{t(accessProvidersMap.get(access.configType)?.name || "")}</div>
              </div>

              <div className="sm:w-60 w-full pt-1 sm:pt-0 flex items-center">{access.created && convertZulu2Beijing(access.created)}</div>
              <div className="sm:w-60 w-full pt-1 sm:pt-0 flex items-center">{access.updated && convertZulu2Beijing(access.updated)}</div>
              <div className="flex items-center grow justify-start pt-1 sm:pt-0">
                <AccessEditDialog
                  trigger={
                    <Button variant={"link"} className="p-0">
                      {t("common.edit")}
                    </Button>
                  }
                  op="edit"
                  data={access}
                />
                <Separator orientation="vertical" className="h-4 mx-2" />
                <AccessEditDialog
                  trigger={
                    <Button variant={"link"} className="p-0">
                      {t("common.copy")}
                    </Button>
                  }
                  op="copy"
                  data={access}
                />
                <Separator orientation="vertical" className="h-4 mx-2" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={"link"} className="p-0">
                      {t("common.delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="dark:text-gray-200">{t("access.authorization.delete")}</AlertDialogTitle>
                      <AlertDialogDescription>{t("access.authorization.delete.confirm")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="dark:text-gray-200">{t("common.cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleDelete(access);
                        }}
                      >
                        {t("common.confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          <XPagination
            totalPages={totalPages}
            currentPage={pageNumber}
            onPageChange={(page) => {
              query.set("page", page.toString());
              navigate({ search: query.toString() });
            }}
          />
        </>
      )}
    </div>
  );
};

export default Access;
