import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/code_repositories/code_repositoriesSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const Code_repositoriesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { code_repositories } = useAppSelector((state) => state.code_repositories)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View code_repositories')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View code_repositories')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/code_repositories/code_repositories-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>ClientFolder</p>
                    <p>{code_repositories?.client_folder}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>ServerFolder</p>
                    <p>{code_repositories?.server_folder}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Project</p>

                        <p>{code_repositories?.project?.name ?? 'No data'}</p>

                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/code_repositories/code_repositories-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

Code_repositoriesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default Code_repositoriesView;
